import { ObjectId } from 'mongodb';
import { ingredienteModel } from '../models/ingrediente.js';
import { pizzaModel } from '../models/pizza.js';
import { pedidoModel } from '../models/pedido.js';
import { repartidorModel } from '../models/repartidor.js';
import { clienteModel } from '../models/cliente.js';
import { connection } from '../persistence/db.js';
import inquirer from 'inquirer';

export async function realizarPedido() {
  const session = (await connection()).client.startSession();
  try {
    await session.withTransaction(async () => {
      const ingredienteModelVar = await ingredienteModel();
      const pizzaModelVar = await pizzaModel();
      const pedidoModelVar = await pedidoModel();
      const repartidorModelVar = await repartidorModel();
      const clienteModelVar = await clienteModel();

      // 1. Buscar cliente por nombre
      const { nombreCliente } = await inquirer.prompt([
        {
          type: 'input',
          name: 'nombreCliente',
          message: 'Ingresa el nombre del cliente (o parte de él):',
          validate: input => input.trim().length > 0 || 'El nombre no puede estar vacío'
        }
      ]);

      const clientes = await clienteModelVar
        .find({ nombre: { $regex: nombreCliente, $options: 'i' } })
        .toArray();

      if (clientes.length === 0) {
        throw new Error('No se encontraron clientes con ese nombre');
      }

      console.log('\nCoincidencias de clientes:');
      clientes.forEach((c, index) => {
        console.log(`${index + 1}. ${c.nombre} (Dirección: ${c.direccion}, Teléfono: ${c.telefono})`);
      });

      const { selectedCliente } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedCliente',
          message: 'Selecciona un cliente:',
          choices: clientes.map(c => ({
            name: `${c.nombre} (Dirección: ${c.direccion})`,
            value: c._id.toString()
          }))
        }
      ]);
      const clienteId = new ObjectId(selectedCliente);
      console.log(`Cliente seleccionado: ${clientes.find(c => c._id.toString() === selectedCliente).nombre}`);

      // 2. Seleccionar pizzas
      const pizzaIds = [];
      while (true) {
        const { nombrePizza } = await inquirer.prompt([
          {
            type: 'input',
            name: 'nombrePizza',
            message: 'Ingresa el nombre de la pizza (o parte de él):',
            validate: input => input.trim().length > 0 || 'El nombre no puede estar vacío'
          }
        ]);

        const pizzas = await pizzaModelVar
          .find({ nombre: { $regex: nombrePizza, $options: 'i' } })
          .toArray();

        if (pizzas.length === 0) {
          console.log('No se encontraron pizzas con ese nombre. Intenta de nuevo.');
          continue;
        }

        console.log('\nCoincidencias de pizzas:');
        pizzas.forEach((p, index) => {
          console.log(`${index + 1}. ${p.nombre} (Categoría: ${p.categoria}, Precio: $${p.precio})`);
        });

        const { selectedPizza } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedPizza',
            message: 'Selecciona una pizza:',
            choices: pizzas.map(p => ({
              name: `${p.nombre} (Categoría: ${p.categoria}, Precio: $${p.precio})`,
              value: p._id.toString()
            }))
          }
        ]);
        const pizzaId = new ObjectId(selectedPizza);
        pizzaIds.push(pizzaId);
        console.log(`Pizza seleccionada: ${pizzas.find(p => p._id.toString() === selectedPizza).nombre}`);

        const { continuar } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continuar',
            message: '¿Deseas agregar otra pizza?',
            default: false
          }
        ]);

        if (!continuar) break;
      }

      if (pizzaIds.length === 0) {
        throw new Error('No se seleccionaron pizzas para el pedido');
      }

      // 3. Obtener pizzas y verificar ingredientes
      const pizzas = await pizzaModelVar
        .find({ _id: { $in: pizzaIds.map(id => new ObjectId(id)) } })
        .toArray();
      if (pizzas.length !== pizzaIds.length) {
        throw new Error('Una o más pizzas no existen');
      }

      const ingredientesNecesarios = {};
      for (const pizza of pizzas) {
        for (const ing of pizza.ingredientes) {
          ingredientesNecesarios[ing.nombre] = (ingredientesNecesarios[ing.nombre] || 0) + ing.cantidad;
        }
      }

      // 4. Verificar stock de ingredientes
      for (const [nombre, cantidad] of Object.entries(ingredientesNecesarios)) {
        const ingrediente = await ingredienteModelVar.findOne({ nombre });
        if (!ingrediente || ingrediente.stock < cantidad) {
          throw new Error(`Ingrediente ${nombre} sin stock suficiente`);
        }
      }

      // 5. Restar del inventario
      for (const [nombre, cantidad] of Object.entries(ingredientesNecesarios)) {
        await ingredienteModelVar.updateOne(
          { nombre },
          { $inc: { stock: -cantidad } },
          { session }
        );
      }

      // 6. Calcular total del pedido
      const total = pizzas.reduce((sum, pizza) => sum + pizza.precio, 0);

      // 7. Asignar repartidor
      const repartidor = await repartidorModelVar.findOneAndUpdate(
        { estado: 'disponible' },
        { $set: { estado: 'ocupado' } },
        { returnDocument: 'after', session }
      );
      if (!repartidor) throw new Error('No hay repartidores disponibles');

      // 8. Registrar pedido
      const pedido = {
        clienteId: new ObjectId(clienteId),
        pizzas: pizzaIds.map(id => new ObjectId(id)),
        total,
        fecha: new Date(),
        repartidorAsignado: repartidor._id
      };
      await pedidoModelVar.insertOne(pedido, { session });

      console.log('Pedido registrado con éxito:', pedido);
      return pedido;
    });
  } catch (error) {
    console.error('Error en el pedido:', error.message);
    throw error;
  } finally {
    await session.endSession();
  }
}
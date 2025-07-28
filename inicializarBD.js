const { MongoClient } = require('mongodb');

async function initDB() {
  const uri = 'mongodb+srv://sebas:hola123@sebas.appw5ak.mongodb.net/';
  const dbName = 'pizza_y_punto';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    await db.collection('ingredientes').drop();
    await db.collection('pizzas').drop();
    await db.collection('pedidos').drop();
    await db.collection('repartidores').drop();
    await db.collection('clientes').drop();

    const ingredientes = await db.collection('ingredientes').insertMany([
      { nombre: 'Queso Mozzarella', tipo: 'queso', stock: 100 },
      { nombre: 'Salsa de Tomate', tipo: 'salsa', stock: 50 },
      { nombre: 'Pepperoni', tipo: 'topping', stock: 30 },
      { nombre: 'Champiñones', tipo: 'topping', stock: 20 },
      { nombre: 'Albahaca', tipo: 'topping', stock: 15 }
    ]);
    const ingredienteIds = ingredientes.insertedIds;

    const pizzas = await db.collection('pizzas').insertMany([
      {
        nombre: 'Margarita',
        categoria: 'tradicional',
        precio: 10.99,
        ingredientes: [
          { nombre: 'Queso Mozzarella', cantidad: 2 },
          { nombre: 'Salsa de Tomate', cantidad: 1 },
          { nombre: 'Albahaca', cantidad: 0.5 }
        ]
      },
      {
        nombre: 'Pepperoni',
        categoria: 'especial',
        precio: 12.99,
        ingredientes: [
          { nombre: 'Queso Mozzarella', cantidad: 2 },
          { nombre: 'Salsa de Tomate', cantidad: 1 },
          { nombre: 'Pepperoni', cantidad: 1 }
        ]
      },
      {
        nombre: 'Vegana',
        categoria: 'vegana',
        precio: 11.99,
        ingredientes: [
          { nombre: 'Champiñones', cantidad: 1 },
          { nombre: 'Salsa de Tomate', cantidad: 1 }
        ]
      }
    ]);
    const pizzaIds = pizzas.insertedIds;

    const clientes = await db.collection('clientes').insertMany([
      { nombre: 'Juan Pérez', telefono: '123456789', direccion: 'Calle 123' },
      { nombre: 'María Gómez', telefono: '987654321', direccion: 'Avenida 456' }
    ]);
    const clienteIds = clientes.insertedIds;

    const repartidores = await db.collection('repartidores').insertMany([
      { nombre: 'Ana López', zona: 'Centro', estado: 'disponible' },
      { nombre: 'Carlos Ruiz', zona: 'Norte', estado: 'disponible' }
    ]);
    const repartidorIds = repartidores.insertedIds;

    await db.collection('pedidos').insertMany([
      {
        clienteId: clienteIds[0],
        pizzas: [pizzaIds[0], pizzaIds[1]],
        total: 23.98,
        fecha: new Date(),
        repartidorAsignado: repartidorIds[0]
      },
      {
        clienteId: clienteIds[1],
        pizzas: [pizzaIds[2]],
        total: 11.99,
        fecha: new Date(new Date().setDate(new Date().getDate() - 10)),
        repartidorAsignado: repartidorIds[1]
      }
    ]);

    console.log('Base de datos inicializada con éxito');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    await client.close();
  }
}

initDB().catch(console.error);
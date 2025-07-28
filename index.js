import inquirer from 'inquirer';
import { realizarPedido } from './services/pedidoService.js';
import { ingredientesMasUtilizados, promedioPreciosPorCategoria, categoriaMasVendida } from './services/reporteService.js';
import { closeDB } from './persistence/db.js';

async function main() {
  while (true) {
    const { opcion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'opcion',
        message: 'Selecciona una opción:',
        choices: [
          'Realizar pedido',
          'Ingredientes más utilizados',
          'Promedio de precios por categoría',
          'Categoría más vendida',
          'Salir'
        ]
      }
    ]);

    if (opcion === 'Salir') {
      await closeDB();
      console.log('¡Hasta pronto!');
      break;
    }

    switch (opcion) {
      case 'Realizar pedido':
        try {
          await realizarPedido();
        } catch (error) {
          console.error('No se pudo realizar el pedido:', error.message);
        }
        break;

      case 'Ingredientes más utilizados':
        await ingredientesMasUtilizados();
        break;

      case 'Promedio de precios por categoría':
        await promedioPreciosPorCategoria();
        break;

      case 'Categoría más vendida':
        await categoriaMasVendida();
        break;
    }
  }
}

main().catch(console.error);
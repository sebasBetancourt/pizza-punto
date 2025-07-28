import {pedidoModel} from '../models/pedido.js';
import {pizzaModel} from '../models/pizza.js';

export async function ingredientesMasUtilizados() {
  const pedidoModelVar = await pedidoModel();
  const pizzaModelVar = await pizzaModel();

  const result = await pedidoModelVar.aggregate([
    { $match: { fecha: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } } },
    { $unwind: '$pizzas' },
    {
      $lookup: {
        from: 'pizzas',
        localField: 'pizzas',
        foreignField: '_id',
        as: 'pizza'
      }
    },
    { $unwind: '$pizza' },
    { $unwind: '$pizza.ingredientes' },
    {
      $group: {
        _id: '$pizza.ingredientes.nombre',
        total: { $sum: '$pizza.ingredientes.cantidad' }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]).toArray();

  console.log('Ingredientes más utilizados en el último mes:');
  result.forEach(r => console.log(`- ${r._id}: ${r.total} unidades`));
  return result;
}

export async function promedioPreciosPorCategoria() {
  const pizzaModelVar = await pizzaModel();
  const result = await pizzaModelVar.aggregate([
    {
      $group: {
        _id: '$categoria',
        promedio: { $avg: '$precio' }
      }
    },
    { $sort: { _id: 1 } }
  ]).toArray();

  console.log('Promedio de precios por categoría:');
  result.forEach(r => console.log(`- ${r._id}: $${r.promedio.toFixed(2)}`));
  return result;
}

export async function categoriaMasVendida() {
  const pedidoModelVar = await pedidoModel();
  const result = await pedidoModelVar.aggregate([
    { $unwind: '$pizzas' },
    {
      $lookup: {
        from: 'pizzas',
        localField: 'pizzas',
        foreignField: '_id',
        as: 'pizza'
      }
    },
    { $unwind: '$pizza' },
    {
      $group: {
        _id: '$pizza.categoria',
        total: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 1 }
  ]).toArray();

  console.log('Categoría más vendida:');
  result.forEach(r => console.log(`- ${r._id}: ${r.total} ventas`));
  return result;
}

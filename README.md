# Sistema de Gestión de Pizzería

## Descripción del Sistema
Este proyecto es una aplicación de consola desarrollada en Node.js con MongoDB para gestionar pedidos de una pizzería. Permite realizar pedidos, consultar ingredientes más utilizados, promedios de precios por categoría y la categoría más vendida. Utiliza transacciones para garantizar la consistencia de los datos y la biblioteca **inquirer** para una interfaz interactiva en la consola.


## Instalación
1. Clona el repositorio o descarga los archivos del proyecto.
2. Navega al directorio del proyecto:
   ```
   cd pizza-punto
   ```
3. Instala las dependencias:
   ```
   npm install inquirer mongodb
   ```

## Instrucciones para Ejecutar la Aplicación
1. Inicia la aplicación ejecutando el archivo principal:
   ```
   node index.js
   ```
2. Sigue las instrucciones en la consola para interactuar con el menú.

## Comandos Disponibles
El menú interactivo ofrece las siguientes opciones:
1. **Realizar pedido**: Permite registrar un nuevo pedido seleccionando un cliente, pizzas y asignando un repartidor.
2. **Ingredientes más utilizados**: Muestra los 5 ingredientes más usados en pedidos del último mes.
3. **Promedio de precios por categoría**: Calcula el precio promedio de las pizzas por categoría.
4. **Categoría más vendida**: Identifica la categoría de pizza con más ventas.
5. **Salir**: Cierra la conexión con la base de datos y finaliza la aplicación.

## Transacciones
Las transacciones se implementan en la función ***realizarPedido*** utilizando sesiones de MongoDB para garantizar atomicidad. Los pasos incluyen:
1. **Búsqueda de cliente**: Se busca un cliente por nombre y se selecciona uno de las coincidencias.
2. **Selección de pizzas**: Se buscan pizzas por nombre, se seleccionan una o más, y se verifica el stock de ingredientes.
3. **Actualización de inventario**: Se reduce el stock de ingredientes necesarios.
4. **Asignación de repartidor**: Se asigna un repartidor disponible, cambiando su estado a "ocupado".
5. **Registro del pedido**: Se guarda el pedido con los datos del cliente, pizzas, total, fecha y repartidor asignado.
Si ocurre un error en cualquier paso, la transacción se revierte para mantener la consistencia.

## Ejemplos de Uso de Consultas con Aggregation
### 1. Ingredientes Más Utilizados

Esta consulta devuelve los 5 ingredientes más utilizados en pedidos del último mes.

**Salida de ejemplo**:
```
Ingredientes más utilizados en el último mes:
- Queso: 150 unidades
- Tomate: 120 unidades
- Pepperoni: 100 unidades
- Cebolla: 80 unidades
- Albahaca: 50 unidades
```

### 2. Promedio de Precios por Categoría
Calcula el precio promedio de las pizzas agrupadas por categoría.

**Salida de ejemplo**:
```
Promedio de precios por categoría:
- Clásica: $12.50
- Gourmet: $18.75
- Vegetariana: $15.30
```

### 3. Categoría Más Vendida
Identifica la categoría con mayor número de pizzas vendidas.

**Salida de ejemplo**:
```
Categoría más vendida:
- Clásica: 200 ventas
```
## Autores:
1. Sebastian Mauricio Betancourt
2. Alejandro Naranjo
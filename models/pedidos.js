
class Pedido{
    constructor(pizzas, total, fecha, repartidorAsignado){
        this.pizzas = pizzas;
        this.total = total;
        this.fecha = fecha;
        this.repartidorAsignado = repartidorAsignado
    }


    mostrarIngredientes(){
        console.log('Pizzas: '+this.pizzas, 'Total: '+this.tipo, 'Stock: '+this.stock);
    }
}

module.exports = Ingrediente
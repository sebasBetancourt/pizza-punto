
class Ingrediente{
    constructor(nombre, tipo, stock){
        this.nombre = nombre;
        this.tipo = tipo;
        this.stock = stock
    }


    mostrarIngredientes(){
        console.log('Nombre: '+this.nombre, 'Tipo: '+this.tipo, 'Stock: '+this.stock);
    }
}

module.exports = Ingrediente
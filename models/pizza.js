
class Pizza{
    constructor(nombre, categoria, precio, ingredientes){
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.ingredientes = ingredientes
    }


    mostrarPizza(){
        console.log('Nombre: '+this.nombre, 'Tipo: '+this.categoria, 'Stock: '+this.precio, 'Ingredientes: '+this.ingredientes);
    }
}

module.exports = Pizza
import {MongoClient} from 'mongodb';

const uri = "mongodb://localhost:27017/";
const nombreDB = "administrador-tareas";
const cliente = new MongoClient(uri);

export async function connection() {
    await cliente.connect();
    return cliente.db(nombreDB);
}

export async function closeDB() {
  if (cliente) {
    await cliente.close();
    console.log('Conexión a MongoDB cerrada');
  }
}
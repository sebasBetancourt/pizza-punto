import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://sebas:hola123@sebas.appw5ak.mongodb.net/';
const dbName = 'pizza_y_punto';

let client;
let db;

export async function connection() {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log('Conectado a MongoDB');
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('Conexión a MongoDB cerrada');
  }
}
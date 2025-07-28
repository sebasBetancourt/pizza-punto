import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'pizza_y_punto';

let client;
let db;

export async function connection() {
  if (db) return db;
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
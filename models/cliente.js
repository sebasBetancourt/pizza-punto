import { connection } from "../persistence/db.js";

export async function clienteModel() {
  const db = await connection();
  return db.collection('clientes')
}
import { connection } from "../persistence/db";

export async function clienteModel() {
  const db = await connection();
  return db.collection('clientes')
}
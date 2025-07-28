import { connection } from "../persistence/db";

export async function repartidorModel() {
  const db = await connection();
  return db.collection('repartidores')
}
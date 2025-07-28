import { connection } from "../persistence/db.js";

export async function repartidorModel() {
  const db = await connection();
  return db.collection('repartidores')
}
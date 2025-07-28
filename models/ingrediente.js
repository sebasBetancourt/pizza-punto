import { connection } from "../persistence/db.js";

export async function ingredienteModel() {
  const db = await connection();
  return db.collection('ingredientes');
}
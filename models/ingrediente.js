import { connection } from "../persistence/db";

export async function IngredienteModel() {
  const db = await connection();
  return db.collection('ingredientes');
}
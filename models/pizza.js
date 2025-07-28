import { connection } from "../persistence/db.js";

export async function pizzaModel(){
    const db = await connection();
    return db.collection('pizzas')
}
import { connection } from "../persistence/db";

export async function pizzaModel(){
    const db = await connection();
    return db.collection('pizzas')
}
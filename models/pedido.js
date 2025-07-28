import { connection } from "../persistence/db.js";

export async function pedidoModel(){
    const db = await connection();
    return db.collection('pedidos')
}
import { connection } from "../persistence/db";

export async function pedidoModel(){
    const db = await connection();
    return db.collection('pedidos')
}
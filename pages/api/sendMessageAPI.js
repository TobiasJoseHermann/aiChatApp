import { getDb } from '../../utils/db'
import sql from 'mssql'

export default async function handler(req, res) {
    try {
        let pool = await getDb()
        console.log(req.body.nombreUsuario, req.body.contrasena)
        let result = await pool.request()
            .input('text', sql.NVarChar, req.body.message)
            .input('conversation_id', sql.Int, req.body.conversation_id)
            .query('INSERT INTO UserMessage (text, conversation_id) VALUES (@text,@conversation_id)')
        res.status(200).json({message: "Mensaje enviado"})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}
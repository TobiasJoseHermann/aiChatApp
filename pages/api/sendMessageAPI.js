import { getDb } from '../../utils/db'
import sql from 'mssql'
import axios from 'axios' // Importa axios

export default async function handler(req, res) {
    try {
        let pool = await getDb()
        let result = await pool.request()
            .input('text', sql.VarChar, req.body.message)
            .input('conversation_id', sql.Int, req.body.conversation_id)
            .input('is_ai_response', sql.Bit, 0)
            .query('INSERT INTO UserMessage (text, conversation_id, is_ai_response) VALUES (@text,@conversation_id,@is_ai_response)')

        const aiResponse = await axios.get(process.env.NEXT_PUBLIC_VERTEX_AI_URL, {
            params: { user_input: req.body.message } 
        })

        result = await pool.request()
            .input('text', sql.VarChar, aiResponse.data.content)
            .input('conversation_id', sql.Int, req.body.conversation_id)
            .input('is_ai_response', sql.Bit, 1)
            .query('INSERT INTO UserMessage (text, conversation_id, is_ai_response) VALUES (@text,@conversation_id,@is_ai_response)')

        res.status(200).json({message: "Mensaje enviado"})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}
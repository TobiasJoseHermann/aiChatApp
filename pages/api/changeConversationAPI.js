import { getDb } from '../../utils/db'
import sql from 'mssql'

export default async function handler(req, res) {
    try {
        let pool = await getDb()
        let result = await pool.request()
            .input('id', sql.Int, req.body.id)
            .query('SELECT * FROM UserMessage WHERE conversation_id = @id')
        console.log(result.recordset)
        res.status(200).json(result.recordset)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
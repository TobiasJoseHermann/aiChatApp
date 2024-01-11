import { getDb } from '../../utils/db'
import sql from 'mssql'

export default async function handler(req, res) {
    try {
        let pool = await getDb()
        let result = await pool.request()
            .input('name', sql.NVarChar, req.body.name)
            .query('INSERT INTO Conversation (name) VALUES (@name)')
        res.status(200).json({message: "Conversation added"})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}
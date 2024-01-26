import { getDb } from '../../utils/db'
import sql from 'mssql'

export default async function handler(req, res) {
    try {
        let pool = await getDb()
        let result = await pool.request()
            .input('name', sql.VarChar, req.body.name)
            .input('email', sql.VarChar, req.body.email)
            .query('INSERT INTO Conversation (name, email) VALUES (@name, @email)')
        res.status(200).json({message: "Conversation added"})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: err.message})
    }
}
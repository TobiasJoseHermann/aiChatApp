import { getDb } from '../../utils/db'

export default async function handler(req, res) {
    try {
        let pool = await getDb()
        console.log("req.body", req.body)
        let result = await pool.request()
            .input('email', req.body.email)
            .query('SELECT * FROM Conversation WHERE email = @email')
        res.status(200).json(result.recordset)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
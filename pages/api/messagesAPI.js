import { getDb } from '../../utils/db'

export default async function handler(req, res) {
    try {
        let pool = await getDb(req.body.nombreUsuario, req.body.contrasena)
        let result = await pool.request().query('SELECT * FROM UserMessage')
        res.status(200).json(result.recordset)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
import { getDb } from '../../utils/db'

export default async function handler(req, res) {
    try {
        let pool = await getDb(req.body.nombreUsuario, req.body.contrasena)
        res.status(200).json({message: "Conexión exitosa"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
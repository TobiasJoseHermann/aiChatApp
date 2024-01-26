// import { getDb } from '../../utils/db'

// export default async function handler(req, res) {
//     try {
//         let pool = await getDb(req, req.body.contrasena)
//         res.status(200).json({message: "Conexión exitosa"})
//     } catch (err) {
//         res.status(500).json({error: err.message})
//     }
// }


import { getDb } from '../../utils/db'
import * as admin from "firebase-admin"
// import { google } from "googleapis"


if (!admin.apps.length) {

    const { private_key } = process.env.PRIVATE_KEY ? JSON.parse(process.env.PRIVATE_KEY) : undefined

    admin.initializeApp({
        credential: admin.credential.cert({
            "type": process.env.TYPE,
            "project_id": process.env.PROJECT_ID,
            "private_key_id": process.env.PRIVATE_KEY_ID,
            "private_key": private_key,
            "client_email": process.env.CLIENT_EMAIL,
            "client_id": process.env.CLIENT_ID,
            "auth_uri": process.env.AUTH_URI,
            "token_uri": process.env.TOKEN_URI,
            "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
            "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
        })
    });
}

export default async function handler(req, res) {

    try {
        const token = req.body.token;
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (!decodedToken) {
            res.status(403).json({message: "Acceso no autorizado"});
            return;
        }

        let pool = await getDb(process.env.DB_USERNAME, process.env.DB_PASSWORD)
        res.status(200).json({message: "Conexión exitosa"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
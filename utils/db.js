// db.js
import sql from 'mssql'

let pool = null;

export async function getDb(nombreUsuario=null, contrasena=null) {
    const config = {
        user: nombreUsuario,
        password: contrasena,
        server: process.env.SQL_SERVER_URL, // You will need to set this environment variable
        database: 'aiChatApp', // Update with your database name
        options: {
            encrypt: true, // for azure
            trustServerCertificate: true // change to true for local dev / self-signed certs
        },
    }

    if (pool == null) {
        pool = await sql.connect(config)
    }

    return pool;
}
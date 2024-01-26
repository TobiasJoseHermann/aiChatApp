import { getDb } from '../../utils/db'
import sql from 'mssql'

export default async function handler(req, res) {
    let pool = await getDb()
    let transaction = new sql.Transaction(pool)

    transaction.begin(err => {
        if (err) {
            console.log(err)
            res.status(500).json({error: err.message})
            return
        }

        let request = new sql.Request(transaction)
        request.input('id', sql.Int, req.body.id)
            .query('DELETE FROM UserMessage WHERE conversation_id = @id', (err, result) => {
                if (err) {
                    console.log(err)
                    transaction.rollback(() => {
                        res.status(500).json({error: err.message})
                    })
                } else {
                    request.query('DELETE FROM Conversation WHERE conversation_id = @id', (err, result) => {
                        if (err) {
                            console.log(err)
                            transaction.rollback(() => {
                                res.status(500).json({error: err.message})
                            })
                        } else {
                            transaction.commit(err => {
                                if (err) {
                                    console.log(err)
                                    res.status(500).json({error: err.message})
                                    return
                                }
                                res.status(200).json({message: "Conversation deleted"})
                            })
                        }
                    })
                }
            })
    })
}
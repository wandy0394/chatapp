import {Connection, ResultSetHeader, RowDataPacket} from 'mysql2'
import { Conversation } from '../types/conversation'


let db:Connection
class ConversationDAO {
    static initDb(newDb:Connection) {
        if (db === undefined) db = newDb
    }

    static async createConversation(userId:number, label:string, uuid:string):Promise<Conversation> {
        const promise = new Promise<Conversation>((resolve, reject) => {
            try {

                const sqlQuery = `INSERT into Conversations (Owner, Label, UUID)
                                    VALUES (?, ?, ?)`
                db.query(sqlQuery, [userId, label, uuid], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        const row = result as ResultSetHeader
                        console.log(row)
                        console.log(row.insertId)
                        const conversation:Conversation = {
                            id:row.insertId,
                            uuid:uuid,
                            label:label
                        }
                        resolve(conversation)
                    }
                })
            }
            catch (e) {
                console.error(e)
                reject(e)
            }
        })
        return promise
    }
}

export default ConversationDAO
import {Connection, ResultSetHeader, RowDataPacket} from 'mysql2'
import { Conversation } from '../types/conversation'


let db:Connection
class ConversationDAO {
    static initDb(newDb:Connection) {
        if (db === undefined) db = newDb
    }

    static async createConversation(userEmail:string, label:string, uuid:string):Promise<Conversation> {
        const promise = new Promise<Conversation>((resolve, reject) => {
            try {

                const sqlQuery = `INSERT into Conversations (OwnerEmail, Label, UUID)
                                    VALUES (?, ?, ?)`
                db.query(sqlQuery, [userEmail, label, uuid], (err, result, fields) => {
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

    static async addUserToConversation(userId:number, conversationId:number) {
        const promise = new Promise<void>((resolve, reject) => {
            try {
                const sqlQuery = `INSERT into UserConversations (UserId, ConversationId)
                                    VALUES (?, ?)`
                db.query(sqlQuery, [userId, conversationId], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        resolve()
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

    static async getConversationsByUserId(userId:number) {
        const promise = new Promise<Conversation[]>((resolve, reject) => {
            try {
                const sqlQuery = `SELECT c.id, c.uuid, c.label 
                                    FROM Conversations c join UserConversations u 
                                    ON c.id=u.ConversationId 
                                    WHERE u.UserId=?`
                db.query(sqlQuery, [userId], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        const row = result as RowDataPacket[]
                        console.log(row)
                        const conversations:Conversation[] = row.map(r=>{
                            return {
                                id:r.id,
                                uuid:r.uuid,
                                label:r.label
                            }
                        })
                        resolve(conversations)
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

    static async getConversationByUUID(conversationUUID:string) {
        const promise = new Promise<Conversation[]>((resolve, reject) => {
            try {
                const sqlQuery = `SELECT c.id, c.uuid, c.label 
                                    FROM Conversations c 
                                    WHERE c.uuid=?`
                db.query(sqlQuery, [conversationUUID], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        const row = result as RowDataPacket[]
                        console.log(row)
                        const conversations:Conversation[] = row.map(r=>{
                            return {
                                id:r.id,
                                uuid:r.uuid,
                                label:r.label
                            }
                        })
                        resolve(conversations)
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
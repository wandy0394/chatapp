import {Connection, ResultSetHeader, RowDataPacket} from 'mysql2'
import { Conversation } from '../types/conversation'
import { User } from '../types/user'
import { ChatMessage } from '../types/message'


export const STATUS = {
    USER_INVITED:"USER_INVITED",
    USER_JOINED:"USER_JOINED",
    USER_LEFT:"USER_LEFT"
}

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

    static async addUserToConversation(userId:number, conversationId:number, status:string) {
        const promise = new Promise<void>((resolve, reject) => {
            try {
                const sqlQuery = `INSERT into UserConversations (UserId, ConversationId, Status)
                                    VALUES (?, ?, ?)`
                db.query(sqlQuery, [userId, conversationId, status], (err, result, fields) => {
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

    static async getUsersByConversationId(conversationId:number) {
        const promise = new Promise<User[]>((resolve, reject) => {
            try {
                const sqlQuery = `SELECT u.username, u.userUUID, u.email, u.id
                                    FROM Users u join UserConversations uc 
                                    ON uc.UserId=u.id 
                                    WHERE uc.ConversationId=?`
                db.query(sqlQuery, [conversationId], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        const row = result as RowDataPacket[]
                        // console.log(row)
                        const users:User[] = row.map(r=>{
                            return {
                                id:r.id,
                                username:r.username,
                                userUUID:r.userUUID,
                                email:r.email
                            }
                        })
                        resolve(users)
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

    static async getJoinedConversationsByUserId(userId:number) {
        const promise = new Promise<Conversation[]>((resolve, reject) => {
            try {
                const sqlQuery = `SELECT c.id, c.uuid, c.label 
                                    FROM Conversations c join UserConversations u 
                                    ON c.id=u.ConversationId 
                                    WHERE u.UserId=? AND u.Status=?`
                db.query(sqlQuery, [userId, STATUS.USER_JOINED], (err, result, fields) => {
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
                        //TODO: fix this. Should not return array but a single unique value assuming UUIDs are unique
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


    

    static async updateUserConversationStatus(status:string, conversationId:number, userId:number) {
        const promise = new Promise<void>((resolve, reject) => {
            try {
                const sqlQuery = `UPDATE UserConversations SET Status = ? WHERE ConversationId = ? and UserId = ?`
                db.query(sqlQuery, [status, conversationId, userId], (err, result, fields) => {
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

    static async insertConversationLine(content:string, conversationId:number, username:string, userId:number, timestamp:Date) {
        const promise = new Promise<void>((resolve, reject) => {
            try {
                const sqlQuery = `INSERT INTO ConversationLine (content, conversationId, username, userId, timestamp) 
                                    VALUES (?, ?, ?, ?, ?)`
                db.query(sqlQuery, [content, conversationId, username, userId, timestamp], (err, result, fields) => {
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

    static async getConversationLine(conversationId:number, conversationUUID:string):Promise<ChatMessage[]> {
        const promise = new Promise<ChatMessage[]>((resolve, reject) => {
            try {
                const sqlQuery = `SELECT
                                    u.id, u.username, u.userUUID, u.email, c.content, c.timestamp 
                                    FROM ConversationLine as c join Users as u
                                    ON c.userId = u.id
                                    WHERE conversationId = ? 
                                    ORDER BY timestamp DESC
                                    LIMIT 30`
                db.query(sqlQuery, [conversationId], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        const rows = result as RowDataPacket[]
                        const messages:ChatMessage[] = rows.map(r=> {
                            return {
                                author: {
                                    username:r.username,
                                    userUUID:r.userUUID,
                                    email:r.email,
                                    id:r.id
                                },
                                content:r.content,
                                timestamp:r.timestamp,
                                conversationRoomId:conversationUUID
                            }

                        })
                        resolve(messages)
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


    static async getUsersInConversationByUUID(conversationUUID:string):Promise<User[]> {
        const promise = new Promise<User[]>((resolve, reject) =>{
            try {
                const sqlQuery = `SELECT
                                    u.id, u.username, u.userUUID, u.email 
                                    FROM UserConversations as uc 
                                    JOIN Users as u
                                    ON uc.userId = u.id
                                    JOIN Conversations c
                                    ON c.id = uc.conversationId
                                    WHERE c.uuid = ? 
                                    `
                db.query(sqlQuery, [conversationUUID], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        const rows = result as RowDataPacket[]
                        const users:User[] = rows.map(r=> {
                            return {
                                username:r.username,
                                userUUID:r.userUUID,
                                email:r.email,
                                id:r.id
                            }

                        })
                        resolve(users)
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
import {Connection, ResultSetHeader, RowDataPacket} from 'mysql2'
import { Session } from '../types/session'


let db:Connection


class SessionsDAO {
    static initDb(newDb:Connection) {
        if (db === undefined) db = newDb
    }

    static async addSession(sid:string, userEmail:string, userId:number):Promise<boolean> {
        if (!sid || !userEmail || !userId) throw Error('Missing parameters sid, userEmail or userId')
        const promise:Promise<boolean> = new Promise((resolve, reject)=>{
            try {
                const values={
                    SessionId:sid,
                    UserEmail:userEmail,
                    UserId:userId
                }

                const sqlQuery:string = `INSERT INTO Sessions set ?`
                db.query(sqlQuery, [values], (err, results:ResultSetHeader, fields)=>{
                    if (err) {
                        console.log(err)
                        return reject(new Error('Error querying database'))
                    }
                    else {
                        resolve(true)
                    }
                })
            }
            catch(e) {
                console.log(e)
                return reject(e)
            }
        })

        return promise
    }

    static async deleteSessionBySessionId(sid:string):Promise<boolean> {
        if (!sid ) throw Error('Missing sid')
        const promise:Promise<boolean> = new Promise((resolve, reject)=>{
            try {
                //session ids generated by express-session are unique 
                const sqlQuery:string = `DELETE FROM Sessions WHERE SessionId=?`
                db.query(sqlQuery, [sid], (err, results, fields)=>{
                    if (err) {
                        console.log(err)
                        return reject(new Error('Error querying database'))
                    }
                    else {
                        resolve(true)
                    }
                })
            }
            catch(e) {
                return reject(e)
            }
        })

        return promise
    }
    

    static async getSessionBySessionId(sid:string):Promise<Session> {
        if (!sid ) throw Error('Missing sid')
        const promise:Promise<Session> = new Promise((resolve, reject)=>{
            try {
                //session ids generated by express-session are unique 
                const sqlQuery:string = `SELECT * FROM Sessions WHERE SessionId=?`
                db.query(sqlQuery, [sid], (err, results, fields)=>{
                    if (err) {
                        console.log(err)
                        return reject(new Error('Error querying database'))
                    }
                    else {
                        const rows = (results as RowDataPacket[])
                        if (rows.length <= 0) return reject(new Error('No session with sessionid'))
                        resolve({
                            id:rows[0].id,
                            sessionId:rows[0].SessionID,
                            email:rows[0].UserEmail,
                            userUUID:rows[0].UserUUID
                        })
                    }
                })
            }
            catch(e) {
                return reject(e)
            }
        })

        return promise
    }
}

export default SessionsDAO
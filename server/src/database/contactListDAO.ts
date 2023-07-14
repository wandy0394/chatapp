import {Connection, ResultSetHeader, RowDataPacket} from 'mysql2'
import { Contact } from '../types/user'


let db:Connection


class ContactListDAO {
    static initDb(newDb:Connection) {
        if (db === undefined) db = newDb
    }

    static async getContactList(email:string):Promise<Contact[]> {
        let contactList:Contact[] = []
        const promise:Promise<Contact[]> = new Promise((resolve, reject) => {
            try {
                const sqlQuery = `SELECT username, email, userUUID, Contacts.status 
                                    from Users JOIN Contacts 
                                    ON Contacts.AddresseeEmail=Users.email
                                    WHERE Contacts.RequesterEmail = ?`
                db.query(sqlQuery, [email], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    else {
                        const rows = (result as RowDataPacket[])
                        contactList = rows.map((row) => {
                            return {
                                username:row.username,
                                email:row.email,
                                userUUID:row.userUUID,
                                status:row.status
                            }
                        })
                        resolve(contactList)
                    }
                })
            }
            catch (e) {
                reject(e)
            }
        })

        return promise
    }

    static async requestContact(requesterEmail:string, addresseeEmail:string, status:string):Promise<void> {
        const promise:Promise<void> = new Promise((resolve, reject) => {
            try {
                const sqlQuery = `INSERT INTO Contacts (RequesterEmail, AddresseeEmail, Status)
                                    VALUES (?, ?, ?)`
                db.query(sqlQuery, [requesterEmail, addresseeEmail, status], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    resolve()
                })
            }
            catch (e) {
                reject(e)
            }
        })

        return promise
    }

    static async updateContactStatus(requesterEmail:string, addresseeEmail:string, status:string):Promise<void> {
        const promise:Promise<void> = new Promise((resolve, reject) => {
            try {
                const sqlQuery = `UPDATE Contacts 
                                    SET Status = ?
                                    WHERE RequesterEmail = ? AND AddresseeEmail = ?`
                db.query(sqlQuery, [status, addresseeEmail, requesterEmail], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    resolve()
                })
            }
            catch (e) {
                reject(e)
            }
        })

        return promise
    }

    static async checkPendingRequest(requesterEmail:string, addresseeEmail:string):Promise<boolean> {
        const promise:Promise<boolean> = new Promise((resolve, reject) => {
            try {
                const sqlQuery = `SELECT status from Contacts where RequesterEmail=? AND AddresseeEmail=? AND Status='PENDING'`
                console.log(requesterEmail, addresseeEmail)
                db.query(sqlQuery, [addresseeEmail, requesterEmail ], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    const rows = (result as RowDataPacket[])
                    console.log(result)
                    if (rows.length > 0) resolve(true)
                    else resolve(false)
                })
            }
            catch(e) {
                reject(e)
            }
        })
        return promise
    }
    
    static async removeContact(requesterEmail:string, addresseeEmail:string):Promise<boolean> {
        const promise:Promise<boolean> = new Promise((resolve, reject) => {
            try {
                const sqlQuery = `DELETE FROM Contacts where (RequesterEmail=? AND AddresseeEmail=?) OR (RequesterEmail=? AND AddresseeEmail=?)`
                db.query(sqlQuery, [requesterEmail, addresseeEmail, addresseeEmail, requesterEmail], (err, result, fields) => {
                    if (err) {
                        console.error(err)
                        reject (new Error('Error querying database'))
                    }
                    console.log(result)
                    resolve(true)
                })
            }
            catch(e) {
                reject(e)
            }
        })
        return promise
    }
}

export default ContactListDAO
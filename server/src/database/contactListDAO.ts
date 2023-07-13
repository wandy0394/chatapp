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

    static async addContact(requesterEmail:string, addresseeEmail:string):Promise<void> {
        const promise:Promise<void> = new Promise((resolve, reject) => {
            try {
                const sqlQuery = `INSERT INTO Contacts (RequesterEmail, AddresseeEmail)
                                    VALUES (?, ?)`
                db.query(sqlQuery, [requesterEmail, addresseeEmail], (err, result, fields) => {
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
}

export default ContactListDAO
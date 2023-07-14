import { Connection } from "mysql2"
import ContactListDAO from "../database/contactListDAO"
import { Contact, User } from "../types/user"
import UserService from "./userService"

const DUMMY_CONTACTS = [
    {name:'steve', uuid:'1'},
    {name:'adam', uuid:'2'},
    {name:'tarja', uuid:'3'},
    {name:'nikita', uuid:'4'},
]
class ContactListService {

    static injectConn(connection:Connection) {
        ContactListDAO.initDb(connection)
    }
    
    static async getContactList(email:string):Promise<Contact[]> {
        try {
            const result = await ContactListDAO.getContactList(email)
            return result
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
    }

    static async requestContact(requesterEmail:string, addresseeEmail:string):Promise<User> {
        try {
            const addressee = await UserService.getUser(addresseeEmail)
            await ContactListDAO.requestContact(requesterEmail, addresseeEmail, 'PENDING')
            return addressee
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
    }

    static async checkPendingRequest(requesterEmail:string, addresseeEmail:string):Promise<boolean> {
        try {
            const pendingRequestExists = await ContactListDAO.checkPendingRequest(requesterEmail, addresseeEmail)
            return pendingRequestExists
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
    }

    static async acceptContactRequest(requesterEmail:string, addresseeEmail:string) {
        try {
            const addressee = await UserService.getUser(addresseeEmail)
            const status='CONFIRMED'
            await ContactListDAO.updateContactStatus(requesterEmail, addresseeEmail, status)
            await ContactListDAO.requestContact(requesterEmail, addresseeEmail, status)
            return addressee
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
    }

    static async removeContact(requesterEmail:string, addresseeEmail:string):Promise<boolean> {
        try {
            const result = await ContactListDAO.removeContact(requesterEmail, addresseeEmail)
            return result
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
    }

}

export default ContactListService
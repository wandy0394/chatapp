import {Request, Response, NextFunction, CookieOptions} from 'express'
import ContactListService from '../services/contactListService'
import UserService from '../services/userService'
import { UserNotFoundError } from '../exceptions/exceptions'


//requireAuth middleware is used before this is called
class ContactListController {
    static async getContactList(req:Request, res:Response, next:NextFunction) {
        const email = req.body.email
        try {
            const contactList = await ContactListService.getContactList(email)
            res.status(200).send({status:'ok', data:contactList})
        }
        catch (e) {
            res.status(500).send({status:'error', data:{error:'Internal server error.'}})
            return
        }
    }

    static async addContact(req:Request, res:Response, next:NextFunction) {
        const requesterEmail = req.body.email
        const addresseeEmail = req.body.addresseeEmail
        try {
            const addressee = await ContactListService.addContact(requesterEmail, addresseeEmail)
            const userData = {
                username:addressee.username,
                email:addressee.email,
                userUUID:addressee.userUUID
            }
            res.status(200).send({status:'ok', data:userData})
        }
        catch (e) {
            if (e instanceof UserNotFoundError) {
                res.status(500).send({status:'error', data:{error:e.message}})
            }
            else {
                res.status(500).send({status:'error', data:{error:'Internal server error.'}})
            }
            return
        }
    }
}

export default ContactListController
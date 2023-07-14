import {Request, Response, NextFunction, CookieOptions} from 'express'
import ContactListService from '../services/contactListService'
import UserService from '../services/userService'
import { UserNotFoundError } from '../exceptions/exceptions'
import { NotificationService } from '../services/notificationService'
import { Message } from '../types/message'


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

    static async requestContact(req:Request, res:Response, next:NextFunction) {
        const requesterEmail = req.body.email
        const addresseeEmail = req.body.addresseeEmail
        try {

            //check for outstanding request
            const pendingRequestExists = await ContactListService.checkPendingRequest(requesterEmail, addresseeEmail)
            if (pendingRequestExists) {
                const addressee = await ContactListService.acceptContactRequest(requesterEmail, addresseeEmail)
                const userData = {
                    username:addressee.username,
                    email:addressee.email,
                    userUUID:addressee.userUUID
                }
                const message:Message = {
                    from:'System',
                    message: `${requesterEmail} has accepted your contact request.`,
                    id:'1234'
                }
                if (NotificationService.pushNotification(message, addresseeEmail, 'contact-request-accepted')) {
                    res.status(200).send({status:'ok', data:userData})
                }
                else {
                    res.status(200).send({status:'error', data:{error:'Notification not sent.'}})
                }
            }
            else {
                const addressee = await ContactListService.requestContact(requesterEmail, addresseeEmail)
                const userData = {
                    username:addressee.username,
                    email:addressee.email,
                    userUUID:addressee.userUUID
                }
                const message:Message = {
                    from:requesterEmail,
                    message: `You have a contact request from ${requesterEmail}.`,
                    id:'4321'
                }
                if (NotificationService.pushNotification(message, addresseeEmail, 'contact-request')) {
                    res.status(200).send({status:'ok', data:userData})
                }
                else {
                    res.status(200).send({status:'error', data:{error:'Notification not sent.'}})
                }
            }

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

    static async removeContact(req:Request, res:Response, next:NextFunction) {
        
        try {
            const requesterEmail:string = req.body.email
            const addresseeEmail:string = req.body.addresseeEmail
            const result = await ContactListService.removeContact(requesterEmail, addresseeEmail)
            if (result !== undefined) res.status(200).send({status:'ok', data:'Contact deleted.'})
            else res.status(200).send({status:'error', data:'Could not delete contact.'})
        }
        catch (e) {
            res.status(500).send({status:'error', data:{error:'Internal server error.'}})
        }
    }
}

export default ContactListController
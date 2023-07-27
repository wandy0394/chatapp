import {Request, Response, NextFunction, CookieOptions} from 'express'
import ContactListService from '../services/contactListService'
import UserService from '../services/userService'
import { UserNotFoundError } from '../exceptions/exceptions'
import { NotificationService } from '../services/notificationService'
import { Message } from '../types/message'
import {v4 as uuidv4} from 'uuid'

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

    static async acceptContactRequest(req:Request, res:Response, next:NextFunction) {
        const accepterEmail = req.body.email
        const requesterEmail = req.body.requesterEmail
        try {
            //check for outstanding request from the addressee. 
            const pendingRequestExists = await ContactListService.checkPendingRequestByAddressee(accepterEmail, requesterEmail)
            if (pendingRequestExists) {
                const addressee = await ContactListService.acceptContactRequest(accepterEmail, requesterEmail)
                const userData = {
                    username:addressee.username,
                    email:addressee.email,
                    userUUID:addressee.userUUID
                }
                //temporary                
                const message:Message = {
                    from:'System',
                    message: `${accepterEmail} has accepted your contact request.`,
                    id:uuidv4()
                }
                NotificationService.pushNotification(message, requesterEmail, 'contact-request-resolved')
                res.status(200).send({status:'ok', data:userData})
            }
            else {
                res.status(500).send({status:'error', data:{error:'Could not accept request'}})
            }
        }
        catch(e) {
            if (e instanceof UserNotFoundError) {
                res.status(500).send({status:'error', data:{error:e.message}})
            }
            else {
                res.status(500).send({status:'error', data:{error:'Internal server error.'}})
            }
            return
        }
    }

    static async requestContact(req:Request, res:Response, next:NextFunction) {
        const requesterEmail = req.body.email
        const addresseeEmail = req.body.addresseeEmail
        try {

            const pendingRequestExists = await ContactListService.checkPendingRequestByRequester(requesterEmail, addresseeEmail)
            if (pendingRequestExists) {
                const message:Message = {
                    from:'System',
                    message: `You have sent a contact request to ${addresseeEmail} already.`,
                    id:uuidv4()
                }
                NotificationService.pushNotification(message, requesterEmail, 'contact-request-resolved')
                res.status(500).send({status:'error', data:{error:'Request already sent.'}})
            }
            else {

                const addressee = await ContactListService.requestContact(requesterEmail, addresseeEmail)
                const userData = {
                    username:addressee.username,
                    email:addressee.email,
                    userUUID:addressee.userUUID
                }
                //temporary                
                
                const message:Message = {
                    from:requesterEmail,
                    message: `You have a contact request from ${requesterEmail}.`,
                    id:uuidv4()
                }
                NotificationService.pushNotification(message, addresseeEmail, 'contact-request')
                res.status(200).send({status:'ok', data:userData})
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

    static async rejectRequestContact(req:Request, res:Response, next:NextFunction) {
        try {
            const rejecterEmail:string = req.body.email
            const requesterEmail:string = req.body.requesterEmail
            const result = await ContactListService.removeContact(rejecterEmail, requesterEmail)
            if (result !== undefined) {
                //temporary
                const message:Message = {
                    from:'System',
                    message: `Your contact request to ${rejecterEmail} has been rejected.`,
                    id:uuidv4()
                }
                NotificationService.pushNotification(message, requesterEmail, 'contact-request-resolved')
                res.status(200).send({status:'ok', data:'Request rejected'})
            }
            else {
                res.status(200).send({status:'error', data:'Could not reject contact request.'})
            }
        }
        catch (e) {
            res.status(500).send({status:'error', data:{error:'Internal server error.'}})
        }
    }
}

export default ContactListController
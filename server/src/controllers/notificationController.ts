import {Request, Response, NextFunction, CookieOptions} from 'express'
import { NotificationService } from '../services/notificationService'


class NotificationController {
    static async register(req:Request, res:Response, next:NextFunction) {
        const email = req.body.email
        try {
            const client = await NotificationService.register(email, res)
            client.write(`event: registration\n`)
            client.write(`data: Registered as ${email}\n\n`)
        }
        catch (e) {
            res.status(500).send({status:'error', data:{error:'Internal server error.'}})
            return
        }
    }
}

export default NotificationController
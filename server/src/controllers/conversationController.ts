import {Request, Response, NextFunction} from 'express'
import { ConversationService } from '../services/conversationService'

export default class ConversationController {
    static async getConversationHistory(req:Request, res:Response, next:NextFunction) {

    }

    static async createConversation(req:Request, res:Response, next:NextFunction) {

    }

    static async getConversations(req:Request, res:Response, next:NextFunction) {
        const user = req.body.user
        if (user === null || user === undefined) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing user'}})
            return
        }
        try {
            let result = await ConversationService.getConversations(user)
            res.status(200).send({status:'ok', data:result})
        }
        catch(e) {
            res.status(500).send({status:'error', data:{error:'Internal server error.'}})
        }
    }
}
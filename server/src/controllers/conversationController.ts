import {Request, Response, NextFunction} from 'express'
import { ConversationService } from '../services/conversationService'
import { ChatMessage } from '../types/message'

export default class ConversationController {
    static async getConversationHistory(req:Request, res:Response, next:NextFunction) {
        const user = req.body.user
        const conversationUUID = req.params.conversationUUID
        console.log(conversationUUID)
        if (user === null || user === undefined) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing user'}})
            return
        }        
        if (conversationUUID === null || conversationUUID === undefined || conversationUUID === '') {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing conversationUUID'}})
            return
        }
        try {
            const result:ChatMessage[] = await ConversationService.getConversationHistory(conversationUUID)
            res.status(200).send({status:'ok', data:result})
        }
        catch(e) {
            console.error(e)
            res.status(500).send({status:'error', data:{error:'Internal server error.'}})
        }
    }

    static async createConversation(req:Request, res:Response, next:NextFunction) {
        const user = req.body.user
        if (user === null || user === undefined) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing user'}})
            return
        }
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
            console.error(e)
            res.status(500).send({status:'error', data:{error:'Internal server error.'}})
        }
    }
}
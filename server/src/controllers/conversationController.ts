import {Request, Response, NextFunction} from 'express'
import { ConversationService } from '../services/conversationService'
import { ChatMessage } from '../types/message'
import ConversationDAO, { STATUS } from '../database/conversationDAO'
import UserService from '../services/userService'
import {v4 as uuidv4} from 'uuid'
import { Conversation } from '../types/conversation'

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
        const addresseeEmail = req.body.addresseeEmail
        if (user === null || user === undefined) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing user'}})
            return
        }
        if (addresseeEmail === null || addresseeEmail === undefined) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing addressee'}})
            return
        }

        try {
            const uuid = await ConversationService.createConversation(user, addresseeEmail)
            if (uuid !== null) {
                res.status(200).send({status:'ok', data:uuid})
            }
            else {
                res.status(500).send({status:'error', data:{error:'Could not create new conversation.'}})
            }
            // const msg:SystemMessage = {
            //     content:JSON.stringify({
            //         uuid:uuid, 
            //         label:[user.username, addressee.username].join(','),
            //         memberUUIDs:[user.userUUID, addressee.userUUID].join(',')
            //     }),
            //     timestamp: (new Date().toJSON())
            // }

            //TODO: emit on all sockets associated with userEmail
            // socket.emit("createPublicConversation", msg)
            // socket.join(uuid)
            // const addresseeSockets:string[] = ClientService.getSocketIdsByEmail(addresseeEmail)
            // for (let i = 0; i < addresseeSockets.length; i++) {
            //     // io.to(addresseeSockets[i]).emit('conversationInvitation', msg)
            //     io.sockets.sockets.get(addresseeSockets[i])?.join(uuid)
            // }
        }
        catch (e) {
            console.error(e)
            res.status(400).send({status:'error', data:{error:'Internal Server Error'}})
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
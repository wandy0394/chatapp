import {Socket} from 'socket.io'
import { SystemMessage } from '../types/message'
import { Conversation, CreateConversationRequest } from '../types/conversation'
import ConversationDAO from '../database/conversationDAO'
import {v4 as uuidv4} from 'uuid'
import { Connection } from 'mysql2'


export class ConversationService {

    static injectConn(conn:Connection) {
        ConversationDAO.initDb(conn)
    }
    static createPublicConversation(socket:Socket, userId:number) {
        socket.on("createPublicConversation", async (message:string) => {
            console.log(`${message} wants to create a room`)
            console.log(userId)
            const label:string = JSON.parse(message).label
            console.log('the label is ' + label)
            const uuid = uuidv4()
            try {
                const conversation:Conversation = await ConversationDAO.createConversation(userId, label, uuid)
                // await ConversationDAO.addUserToConversation()
                const msg:SystemMessage = {
                    content:JSON.stringify({id:uuid, label:label}),
                    timestamp: (new Date().toJSON())
                }
                socket.emit("createPublicConversation", msg)
            }
            catch (e) {
                console.error(e)
                //TODO:send error notification
            }
        })
    }

    static createPrivateConversation(socket:Socket, userId:number) {
        socket.on("createPrivateConversation", async (message:string) => {
            console.log(`${message} wants to create a room`)
            const label:string = JSON.parse(message).label
            console.log('the label is ' + label)
            const uuid = uuidv4()
            try {
                const conversation:Conversation = await ConversationDAO.createConversation(userId, label, uuid)
                // await ConversationDAO.addUserToConversation()
                const msg:SystemMessage = {
                    content:JSON.stringify({id:uuid, label:label}),
                    timestamp: (new Date().toJSON())
                }
                // socket.emit("createPublicConversation", msg)
            }
            catch (e) {
                console.error(e)
                //TODO:send error notification
            }
        })
    }
}
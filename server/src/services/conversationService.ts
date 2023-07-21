import {Socket} from 'socket.io'
import { SystemMessage } from '../types/message'
import { Conversation, CreateConversationRequest } from '../types/conversation'
import ConversationDAO from '../database/conversationDAO'
import {v4 as uuidv4} from 'uuid'
import { Connection } from 'mysql2'
import UserService from './userService'


export class ConversationService {

    static injectConn(conn:Connection) {
        ConversationDAO.initDb(conn)
    }
    static createPublicConversation(socket:Socket, userEmail:string) {
        if (userEmail === null || userEmail === undefined) return
        if (socket === null || socket === undefined) return
        socket.on("createPublicConversation", async (message:string) => {
            console.log(`${message} wants to create a room`)
            const label:string = JSON.parse(message).label
            const uuid = uuidv4()
            try {
                const conversation:Conversation = await ConversationDAO.createConversation(userEmail, label, uuid)
                const user = await UserService.getUser(userEmail)
                await ConversationDAO.addUserToConversation(user.id, conversation.id)
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

    static createPrivateConversation(socket:Socket, userEmail:string) {
        socket.on("createPrivateConversation", async (message:string) => {
            console.log(`${message} wants to create a room`)
            const label:string = JSON.parse(message).label
            console.log('the label is ' + label)
            const uuid = uuidv4()
            try {
                const conversation:Conversation = await ConversationDAO.createConversation(userEmail, label, uuid)
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

    static getConversationByUserId(socket:Socket, userEmail:string) {
        socket.on('getPublicConversations', async ()=>{
            try {
                const user = await UserService.getUser(userEmail)
                const conversations:Conversation[] = await ConversationDAO.getConversationsByUserId(user.id)
                const msg:SystemMessage = {
                    content:JSON.stringify(conversations),
                    timestamp: (new Date().toJSON())
                }
                socket.emit('getPublicConversations', msg)
            }
            catch (e) {
                console.error(e)
            }
        })
    }

    static joinRoom(socket:Socket) {
        socket.on('joinRoom', async (conversationUUID:string)=>{
            console.log(conversationUUID)
            console.log(`${socket.id} joined room ${conversationUUID}`)
            socket.join(conversationUUID)

            try {

                const conversation = await ConversationDAO.getConversationByUUID(conversationUUID)
                socket.emit('joinRoom', {
                    content:JSON.stringify({id:conversationUUID, label:conversation[0].label}),
                    timestamp:(new Date().toJSON())
                })
            }
            catch (e) {
                console.error(e)
            }
    
        })
    }
}
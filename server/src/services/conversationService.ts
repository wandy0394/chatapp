import {Socket} from 'socket.io'
import { SystemMessage } from '../types/message'
import { Conversation } from '../types/conversation'
import ConversationDAO, { STATUS } from '../database/conversationDAO'
import {v4 as uuidv4} from 'uuid'
import { Connection } from 'mysql2'
import UserService from './userService'
import ClientService from './clientService'
import { io } from '../chat-server'

export class ConversationService {

    static injectConn(conn:Connection) {
        ConversationDAO.initDb(conn)
    }

    static registerClient(sessionId:string, socketId:string, userUUID:string, email:string) {
        //TODO: validation checks
        

    }

    static createPublicConversation(socket:Socket, userEmail:string) {
        //TODO handle errors
        if (userEmail === null || userEmail === undefined) return
        if (socket === null || socket === undefined) return
        socket.on("createPublicConversation", async (message:string) => {
            console.log(`${message} wants to create a room`)
            //TODO sanitinize label? Remove Label entirely??
            const label:string = JSON.parse(message).label
            if (label === null || label === undefined) return

            const addresseeEmail:string = JSON.parse(message).addresseeEmail
            if (addresseeEmail === null || addresseeEmail === undefined) return
            //TODO:validate addressee email. If invalid, then block
            
            const uuid = uuidv4()
            try {
                const conversation:Conversation = await ConversationDAO.createConversation(userEmail, label, uuid)
                const user = await UserService.getUser(userEmail)
                await ConversationDAO.addUserToConversation(user.id, conversation.id, STATUS.USER_JOINED)

                const addressee = await UserService.getUser(addresseeEmail)
                await ConversationDAO.addUserToConversation(addressee.id, conversation.id, STATUS.USER_INVITED)
                const msg:SystemMessage = {
                    content:JSON.stringify({
                        id:uuid, 
                        label:[user.username, addressee.username].join(',')
                    }),
                    timestamp: (new Date().toJSON())
                }

                //TODO: emit on all sockets associated with userEmail
                socket.emit("createPublicConversation", msg)
                const addresseeSockets:string[] = ClientService.getSocketIdsByEmail(addresseeEmail)
                for (let i = 0; i < addresseeSockets.length; i++) {
                    io.to(addresseeSockets[i]).emit('conversationInvitation', msg)
                }
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
                for (let i = 0; i < conversations.length; i++) {
                    const usernames:string[] = await ConversationDAO.getUsersByConversationId(conversations[i].id)
                    conversations[i].label = usernames.join(',')
                }
                //TODO: remove conversation table id (primary key) from msg
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

    static joinRoom(socket:Socket, userEmail:string) {
        socket.on('joinRoom', async (conversationUUID:string)=>{
            console.log(`${socket.id} joined room ${conversationUUID}`)
            try {
                const conversation = await ConversationDAO.getConversationByUUID(conversationUUID)
                if (!(socket.rooms.has(conversationUUID))) {
                    const user = await UserService.getUser(userEmail)
                    await ConversationDAO.updateUserConversationStatus(STATUS.USER_JOINED, conversation[0].id, user.id)
                    socket.join(conversationUUID)
                }
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
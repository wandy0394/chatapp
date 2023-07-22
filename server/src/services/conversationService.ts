import {Socket} from 'socket.io'
import { SystemMessage } from '../types/message'
import { Conversation } from '../types/conversation'
import ConversationDAO, { STATUS } from '../database/conversationDAO'
import {v4 as uuidv4} from 'uuid'
import { Connection } from 'mysql2'
import UserService from './userService'
import ClientService from './clientService'
import { io } from '../chat-server'
import { User } from '../types/user'

export class ConversationService {

    static injectConn(conn:Connection) {
        ConversationDAO.initDb(conn)
    }

    static handleInvitation(socket:Socket, userEmail:string) {
        //invite user into conversation
        socket.on('conversationInvitation', async (conversationUUID:string)=>{
            console.log('recieved invitation request')
            
            try {
                //get user objects for all participants
                const user = await UserService.getUser(userEmail)
                const conversation = await ConversationDAO.getConversationByUUID(conversationUUID)
                const users = await ConversationDAO.getUsersByConversationId(conversation[0].id)
                //update status from invited to joined
                await ConversationDAO.updateUserConversationStatus(STATUS.USER_JOINED, conversation[0].id, user.id)
                //setup message that includes memberUUIDs etc
                const msg:SystemMessage = {
                    content:JSON.stringify({
                        uuid:conversationUUID, 
                        label:users.map(u=>u.username).join(','),
                        memberUUIDs:users.map(u=>u.userUUID).join(',')
                    }),
                    timestamp: (new Date().toJSON())
                }

                //emit message to conversationInvitation
                const addresseeSockets:string[] = ClientService.getSocketIdsByEmail(userEmail)
                for (let i = 0; i < addresseeSockets.length; i++) {
                    io.to(addresseeSockets[i]).emit('conversationInvitation', msg)
                }
            }
            catch (e) {
                console.error((e))
            }
        })
    }

    static createPublicConversation(socket:Socket, userEmail:string) {
        //TODO handle errors
        if (userEmail === null || userEmail === undefined) return
        if (socket === null || socket === undefined) return
        socket.on("createPublicConversation", async (message:string) => {
            console.log(`${message} wants to create a room`)
            const label:string = JSON.parse(message).label
            if (label === null || label === undefined) return

            const addresseeEmail:string = JSON.parse(message).addresseeEmail
            if (addresseeEmail === null || addresseeEmail === undefined) return
            
            try {
                const user = await UserService.getUser(userEmail)
                const userConversations = await ConversationDAO.getConversationsByUserId(user.id)
                const addressee = await UserService.getUser(addresseeEmail)
                const addresseeConversations = await ConversationDAO.getConversationsByUserId(addressee.id)
                const userConversationIds = userConversations.map(conv=>conv.id)
                const addresseeConversationIds = addresseeConversations.map(conv=>conv.id)             
                const commonConversationIds = userConversationIds.filter(conv=>addresseeConversationIds.includes(conv))
                if (commonConversationIds.length > 0) {
                    console.log('Conversation already exists, aborting')
                    return
                }


                const uuid = uuidv4()
                const conversation:Conversation = await ConversationDAO.createConversation(userEmail, label, uuid)
                await ConversationDAO.addUserToConversation(user.id, conversation.id, STATUS.USER_JOINED)
                await ConversationDAO.addUserToConversation(addressee.id, conversation.id, STATUS.USER_INVITED)

                const msg:SystemMessage = {
                    content:JSON.stringify({
                        uuid:uuid, 
                        label:[user.username, addressee.username].join(','),
                        memberUUIDs:[user.userUUID, addressee.userUUID].join(',')
                    }),
                    timestamp: (new Date().toJSON())
                }

                //TODO: emit on all sockets associated with userEmail
                socket.emit("createPublicConversation", msg)
                socket.join(uuid)
                const addresseeSockets:string[] = ClientService.getSocketIdsByEmail(addresseeEmail)
                for (let i = 0; i < addresseeSockets.length; i++) {
                    // io.to(addresseeSockets[i]).emit('conversationInvitation', msg)
                    io.sockets.sockets.get(addresseeSockets[i])?.join(uuid)
                }
            }
            catch (e) {
                console.error(e)
                //TODO:send error notification
            }
        })
    }

    static getConversationByUserEmail(socket:Socket, userEmail:string) {
        socket.on('getPublicConversations', async ()=>{
            try {
                let msgContent = []
                const user = await UserService.getUser(userEmail)
                const conversations:Conversation[] = await ConversationDAO.getJoinedConversationsByUserId(user.id)

                
                //create a new label that is a list of all the usernames of the participants
                
                for (let i = 0; i < conversations.length; i++) {
                    const users:User[] = await ConversationDAO.getUsersByConversationId(conversations[i].id)
                    msgContent.push({
                        label:users.map(u=>u.username).join(','),
                        uuid:conversations[i].uuid,
                        memberUUIDs:users.map(u=>u.userUUID).join(',')
                    })
                }
                
                //TODO: remove conversation table id (primary key) from msg
                const msg:SystemMessage = {
                    content:JSON.stringify(msgContent),
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
            try {
                const conversation = await ConversationDAO.getConversationByUUID(conversationUUID)
                if (!(socket.rooms.has(conversationUUID))) {
                    const user = await UserService.getUser(userEmail)
                    await ConversationDAO.updateUserConversationStatus(STATUS.USER_JOINED, conversation[0].id, user.id)
                    socket.join(conversationUUID)
                    console.log(`${socket.id} joined room ${conversationUUID}`)
                }
                const users:User[] = await ConversationDAO.getUsersByConversationId(conversation[0].id)
                socket.emit('joinRoom', {
                    content:JSON.stringify({
                        uuid:conversationUUID, 
                        label:conversation[0].label,
                        memberUUIDs:users.map(u=>u.userUUID).join(',')
                    }),
                    timestamp:(new Date().toJSON())
                })
            }
            catch (e) {
                console.error(e)
            }
    
        })
    }
}
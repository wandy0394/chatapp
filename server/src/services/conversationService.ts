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
import { NextFunction } from 'express'

export type ConversationResponse = {
    label:string[],
    uuid:string,
    memberUUIDs:string[],
    memberEmails:string[]
}

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
                // const user = await UserService.getUser(userEmail)
                const user = socket.request.user
                const conversation = await ConversationDAO.getConversationByUUID(conversationUUID)
                const users = await ConversationDAO.getUsersByConversationId(conversation[0].id)
                //update status from invited to joined
                // await ConversationDAO.updateUserConversationStatus(STATUS.USER_JOINED, conversation[0].id, user.id)
                //setup message that includes memberUUIDs etc
                const msg:SystemMessage = {
                    content:JSON.stringify({
                        uuid:conversationUUID, 
                        label:users.map(u=>u.username),
                        memberUUIDs:users.map(u=>u.userUUID),
                        memberEmails:users.map(u=>u.email)
                    }),
                    timestamp: (new Date().toJSON())
                }

                //emit message to conversationInvitation
                const addresseeSockets:string[] = ClientService.getSocketIdsByEmail(userEmail)
                for (let i = 0; i < addresseeSockets.length; i++) {
                    io.to(addresseeSockets[i]).emit('conversationInvitation', msg)
                }
                console.log(`Emit invitation response ${addresseeSockets.length} times`)
            }
            catch (e) {
                console.error((e))
            }
        })
    }

    static async getConversationHistory(conversationUUID:string) {
        try {
            const conversation = await ConversationDAO.getConversationByUUID(conversationUUID)
            const history = await ConversationDAO.getConversationLine(conversation[0].id, conversationUUID)
            //TODO strip userId before emitting
            
            return history
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
    }


    static async createConversation(user:User, addresseeEmail:string):Promise<string | null>  {
        
        try {

            const userConversations = await ConversationDAO.getConversationsByUserId(user.id)
            const addressee = await UserService.getUser(addresseeEmail)
            const addresseeConversations = await ConversationDAO.getConversationsByUserId(addressee.id)
            const userConversationIds = userConversations.map(conv=>conv.id)
            const addresseeConversationIds = addresseeConversations.map(conv=>conv.id)             
            const commonConversationIds = userConversationIds.filter(conv=>addresseeConversationIds.includes(conv))
            
            if (commonConversationIds.length > 0) {
                console.log('Conversation already exists, aborting')
                return null
            }
            
            const uuid = uuidv4()
            const conversation:Conversation = await ConversationDAO.createConversation(user.email, addressee.username, uuid)
            await ConversationDAO.addUserToConversation(user.id, conversation.id, STATUS.USER_JOINED)
            await ConversationDAO.addUserToConversation(addressee.id, conversation.id, STATUS.USER_JOINED)
            const userSockets:string[] = ClientService.getSocketIdsByEmail(user.email)
            const addresseeSockets:string[] = ClientService.getSocketIdsByEmail(addresseeEmail)
            
            userSockets.forEach(socket=>{
                io.sockets.sockets.get(socket)?.join(uuid)
            })

            addresseeSockets.forEach(socket=>{
                io.sockets.sockets.get(socket)?.join(uuid)
            })

            return uuid
        }
        catch(e) {
            console.error(e)
            throw(e)
        }
    }


    static async getConversations(user:User):Promise<ConversationResponse[]> {
        if (user === null || user === undefined) throw new Error('User is undefined or null')
        try {
            let result:ConversationResponse[] = []
            const conversations:Conversation[] = await ConversationDAO.getJoinedConversationsByUserId(user.id)

            
            //create a new label that is a list of all the usernames of the participants
            
            for (let i = 0; i < conversations.length; i++) {
                const users:User[] = await ConversationDAO.getUsersByConversationId(conversations[i].id)
                result.push({
                    label:users.map(u=>u.username),
                    uuid:conversations[i].uuid,
                    memberUUIDs:users.map(u=>u.userUUID),
                    memberEmails:users.map(u=>u.email)
                })
            }
            return result
        }
        catch (e) {
            console.error(e)
            throw(e)
        }        
    }

    static async leaveConversation(user:User, conversationUUID:string):Promise<boolean> {
        try {
            const conversation = await ConversationDAO.getConversationByUUID(conversationUUID)
            if (conversation.length <= 0) return false
            const result = await ConversationDAO.updateUserConversationStatus(STATUS.USER_LEFT, conversation[0].id, user.id)
            return true
        }
        catch(e) {
            console.error(e)
            throw(e)
        }
    }

    static async getUsersInConversationByUUID(conversationUUID:string):Promise<User[]> {
        try {
            const users:User[] = await ConversationDAO.getUsersInConversationByUUID(conversationUUID)
            return users
        }
        catch(e) {
            console.error(e)
            throw(e)
        }
    }


    static async getConversationByUUID(conversationUUID:string):Promise<Conversation[]> {
        try {
            const conv = await ConversationDAO.getConversationByUUID(conversationUUID)
            return conv
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
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
                        memberUUIDs:users.map(u=>u.userUUID),
                        memberEmails:users.map(u=>u.email)
                    }),
                    timestamp:(new Date().toJSON())
                })
            }
            catch (e) {
                console.error(e)
            }
    
        })
    }

    static async insertConversationLine(content:string, conversationId:number, username:string, userId:number, timestamp:Date) {
        try {
            await ConversationDAO.insertConversationLine(content, conversationId, username, userId, timestamp)
        }
        catch (e) {
            console.error(e)
        }
    }

    static async updateUserConversationStatus(status:string, conversationId:number, userId:number) {
        try {
            await ConversationDAO.updateUserConversationStatus(status, conversationId, userId)
        }
        catch(e) {
            console.error(e)
            throw(e)
        }
    }

}
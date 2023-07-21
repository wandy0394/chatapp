import express, { Express } from 'express'
import { Server as SocketServer} from "socket.io"
import {createServer} from "http"
import dotenv from 'dotenv'
import { ChatMessage, SystemMessage } from './types/message'
import conversationListener from './v1/listeners/conversationListener'
import chatListener from './v1/listeners/chatListeners'
import {  wrap } from './middleware/sessionMiddleware'
import  { requireAuth2 } from './middleware/requireAuth'

dotenv.config()
type ServerToClientEvents = {
    message:(msg:ChatMessage) => void
    createPublicConversation: (msg:SystemMessage) => void
    getPublicConversations: (msg:SystemMessage) => void
    joinRoom: (msg:SystemMessage) => void

}

type ClientToServerEvents = {
    message:(msg:ChatMessage) => void
    createPublicConversation: (socketId:string) => void
    getPublicConversations: () => void
    joinRoom: (roomId:string) => void
}


const app:Express = express()
const httpServer = createServer(app)
const io:SocketServer<ClientToServerEvents, ServerToClientEvents> = new SocketServer(httpServer, {
    cors: {
        origin:["http://localhost:5173", "http://192.168.0.128:5173"],
        methods:["GET", "POST"],
        credentials:true
    },
    path:'/api/v1/'
})


io.use(wrap(requireAuth2))
io.on("connection", conversationListener)
io.on("connection", chatListener)



export {httpServer}

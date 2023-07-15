import express, { Express, Request, Response } from 'express'
import { Server as SocketServer} from "socket.io"
import {createServer} from "http"
import dotenv from 'dotenv'
import { ChatMessage, SystemMessage } from './types/message'
import {v4 as uuidv4} from 'uuid'
import { User } from './types/user'

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
        methods:["GET", "POST"]
    }
})

type Room = {
    [id:string]:string
}

let rooms:Room = {}
const SYSTEM:User = {
    username: 'SYSTEM',
    email: '',
    userUUID: '',
    id: 99999,
}
io.on("connection", (socket)=>{
    console.log(`connected with ${socket.id}`)
    
    socket.on("message", (message:ChatMessage)=>{
        console.log(`Received message: ${message.content}`)
        if (socket.rooms.has(message.conversationRoomId)) {
            io.to(message.conversationRoomId).emit("message", message)
        }
    })

    socket.on("createPublicConversation", (message) => {
        console.log(`${message} wants to create a room`)
        const newRoomId = uuidv4()
        const name='Test ' + Math.floor(Math.random() * 100)
        rooms[newRoomId] = name
        console.log(rooms)
        const msg:SystemMessage = {
            content:JSON.stringify({id:newRoomId, name:name}),
            timestamp: (new Date().toJSON())
        }
        socket.emit("createPublicConversation", msg)
    })

    socket.on('getPublicConversations', ()=>{
        const msg:SystemMessage = {
            content:JSON.stringify(rooms),
            timestamp: (new Date().toJSON())
        }
        socket.emit('getPublicConversations', msg)
    })

    socket.on('joinRoom', (roomId:string)=>{
        if (roomId in rooms) {
            console.log(`${socket.id} joined room ${roomId}`)
            socket.join(roomId)
        }
        socket.emit('joinRoom', {
            content:JSON.stringify({id:roomId, name:rooms[roomId]}),
            timestamp:(new Date().toJSON())
        })

    })

})


export {httpServer}

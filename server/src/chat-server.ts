import express, { Express, Request, Response } from 'express'
import { Server as SocketServer} from "socket.io"
import {createServer} from "http"
import dotenv from 'dotenv'
import { ChatMessage } from './types/message'
import {v4 as uuidv4} from 'uuid'
import { User } from './types/user'

dotenv.config()
type ServerToClientEvents = {
    message:(msg:ChatMessage) => void
    createPublicConversation: (msg:ChatMessage) => void
    getPublicConversations: (msg:ChatMessage) => void
}

type ClientToServerEvents = {
    message:(msg:ChatMessage) => void
    createPublicConversation: (socketId:string) => void
    getPublicConversations: () => void
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
        io.emit("message", message)
    })

    socket.on("createPublicConversation", (message) => {
        console.log(`${message} wants to create a room`)
        const newRoomId = uuidv4()
        const name='Test ' + Math.floor(Math.random() * 100)
        rooms[newRoomId] = name
        console.log(rooms)
        const msg:ChatMessage = {
            author:SYSTEM,
            content:JSON.stringify({id:newRoomId, name:name}),
            timestamp: (new Date().toJSON())
        }
        socket.emit("createPublicConversation", msg)
    })

    socket.on('getPublicConversations', ()=>{
        const msg:ChatMessage = {
            author:SYSTEM,
            content:JSON.stringify(rooms),
            timestamp: (new Date().toJSON())
        }
        socket.emit('getPublicConversations', msg)
    })

    // socket.on("create-room", (room)=>{

    // })

    // socket.on("change-room", (room)=>{
        
    // })

    // socket.on("join-room", (room, id)=>{
        
    // })
    // socket.on("leave-room", (room, id)=>{
        
    // })
})


export {httpServer}

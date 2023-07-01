import express, { Express, Request, Response } from 'express'
import { Server as SocketServer} from "socket.io"
import {createServer} from "http"
import { Message } from './types/message'


const app:Express = express()
const httpServer = createServer(app)
const io = new SocketServer(httpServer, {
    cors: {
        origin:["http://localhost:5173", "http://192.168.0.128:5173"],
        methods:["GET", "POST"]
    }
})



io.on("connection", (socket)=>{
    console.log(`connected with ${socket.id}`)
    // socket.send(`hello ${socket.id}`)

    socket.on("message", (message:Message)=>{
        console.log(`Received message: ${message.content}`)
        io.emit("message", message)
    })

    socket.on("create-room", (room)=>{

    })

    socket.on("change-room", (room)=>{
        
    })

    socket.on("join-room", (room, id)=>{
        
    })
    socket.on("leave-room", (room, id)=>{
        
    })
})



app.get('/', (req:Request, res:Response)=>{
    res.send('hello')
})

app.use("*", (req:Request, res:Response) => {
    res.status(404).json({error:'Invalid endpoint url'})
})

export {httpServer}
export default app
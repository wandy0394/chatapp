import express, { Express, Request, Response } from 'express'
import { Server as SocketServer} from "socket.io"
import {createServer} from "http"
import { ChatMessage } from './types/message'
import userRouter from './v1/routes/users.routes'
import contactListRouter from './v1/routes/contactList.routes'
import notificationRouter from './v1/routes/notification.routes'
import cors from 'cors'
import helmet from 'helmet'
import sessions from 'express-session'
import dotenv from 'dotenv'

dotenv.config()


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

    socket.on("message", (message:ChatMessage)=>{
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

const allowedOrigins = ['http://192.168.0.128:5173']

app.use(cors({
    //By default, Access-Control-Allow-Origin is *. This cannot be * for credentials to pass through
    // Refer to error 'Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is *
    origin:function(origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg:string = 'The CORS Policy of this site does not allow access from specified Origin.'
            return callback(new Error(msg), false);
        }
        return callback(null, true)
    },
    credentials:true,    //allow HTTP cookies and credentials from the client
}))
app.use(express.json())
app.use(helmet())
app.use(sessions({
    secret:process.env.SESSION_SECRET as string,
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000*60*60*24*3,
        sameSite: process.env.NODE_ENV === 'production'?'none':'lax',
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production'
    }
}))
app.use('/api/v1/users', userRouter)
app.use('/api/v1/contactList', contactListRouter)
// app.get('/notifications', async function(req, res) {
//     console.log('Got notification')
//     console.log(res)
// })
app.use('/notifications', notificationRouter)
app.use("*", (req:Request, res:Response) => {
    res.status(404).json({error:'Invalid endpoint url'})
})

export {httpServer}
export default app
import express, { Express, Request, Response } from 'express'
import { Server as SocketServer} from "socket.io"
import {createServer} from "http"


const app:Express = express()
const httpServer = createServer(app)
const io = new SocketServer(httpServer, {

})

io.on("connection", (socket)=>{
    console.log('connected')
    socket.send("hello")
})

app.get('/', (req:Request, res:Response)=>{
    res.send('hello')
})

app.use("*", (req:Request, res:Response) => {
    res.status(404).json({error:'Invalid endpoint url'})
})

export {httpServer}
export default app
import {Socket, io} from "socket.io-client"
import { ClientToServerEvents, ServerToClientEvents } from "./types"
const webSocket:Socket<ServerToClientEvents, ClientToServerEvents> = io("http://192.168.0.128:4040/", {
    path:"/api/v1/",
    withCredentials:true
})

webSocket.on('connect_error', ()=>{
    console.log('Could not connect need to manually reconnect')
})

export  {webSocket}
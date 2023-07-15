import { ChatMessage } from "../../types/message"
import {Socket} from 'socket.io'

const chatListener = (socket:Socket) => {
    socket.on("message", (message:ChatMessage)=>{
        console.log(`Received message: ${message.content}`)
        if (socket.rooms.has(message.conversationRoomId)) {
            socket.broadcast.to(message.conversationRoomId).emit("message", message)
        }
    })
}

export default chatListener
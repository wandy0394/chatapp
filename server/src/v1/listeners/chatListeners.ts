import { ChatMessage } from "../../types/message"
import {Socket} from 'socket.io'

const chatListener = (socket:Socket) => {
    socket.on("message", (message:ChatMessage)=>{
        console.log(`Received message: ${message.content} for ${message.conversationRoomId}`)
        if (socket.rooms.has(message.conversationRoomId)) {
            console.log('broadcasting')
            socket.broadcast.to(message.conversationRoomId).emit("message", message)
        }
    })
}

export default chatListener
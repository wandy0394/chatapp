import ClientService from "../../services/clientService"
import { ConversationService } from "../../services/conversationService"
import UserService from "../../services/userService"
import { ChatMessage } from "../../types/message"
import {Socket} from 'socket.io'

const chatListener = (socket:Socket) => {
    socket.on("message", async (message:ChatMessage)=>{
        try {
            const user = await UserService.getUser(socket.request.user.email)
            const conversation = await ConversationService.getConversationByUUID(message.conversationRoomId)
            console.log(`Received message: ${message.content} for room ${message.conversationRoomId} by ${user.username}`)

            //TODO: sanitise message before broadcasting or storing in db
            if (socket.rooms.has(message.conversationRoomId)) {
                console.log('broadcasting')
                socket.broadcast.to(message.conversationRoomId).emit("message", message)
                await ConversationService.insertConversationLine(message.content, conversation[0].id, user.username, user.id, new Date())
            }
        }
        catch (e) {
            console.error(e)
            //TODO: send error message to sender, message could not be sent
        }
    })
}

export default chatListener
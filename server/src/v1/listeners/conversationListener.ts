import {Socket} from 'socket.io'
import { ConversationService } from '../../services/conversationService'


declare module "http" {
    interface IncomingMessage {
        user: {
            email:string,
            sessionID:string,
            userUUID:string
        },       
    }
}



const conversationListener = (socket:Socket) => {
    const user = socket.request.user
    if (user === null || user === undefined) return
    console.log('user email is ' + user.email)
    console.log('socketId is ' + socket.id)

    ConversationService.createPublicConversation(socket, user.email)
    ConversationService.getConversationByUserEmail(socket, user.email)
    ConversationService.joinRoom(socket, user.email)
}

export default conversationListener
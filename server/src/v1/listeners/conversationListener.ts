import {Socket} from 'socket.io'
import { ConversationService } from '../../services/conversationService'


declare module "http" {
    interface IncomingMessage {
        user: {
            id:number,
            username:string,
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

    ConversationService.joinRoom(socket, user.email)
    ConversationService.handleInvitation(socket, user.email)

}

export default conversationListener
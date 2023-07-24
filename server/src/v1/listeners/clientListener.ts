import {Socket} from 'socket.io'
import ClientService from '../../services/clientService'
import { ConversationService } from '../../services/conversationService'
import UserService from '../../services/userService'
import ConversationDAO from '../../database/conversationDAO'
import { Conversation } from '../../types/conversation'


const clientListener = async (socket:Socket) => {
    const user = socket.request.user
    if (user === null || user === undefined) return
    console.log('Registration listener')
    console.log('user email is ' + user.email)
    console.log('socketId is ' + socket.id)

    if (!ClientService.registerClient(user.userUUID, user.email, socket.id, user.sessionID)) {
        //covers case where user disconnects but reconnects using the same session. socketId changes
        ClientService.updateClientSocketId(user.sessionID, socket.id)
        try {

            let userObj = await UserService.getUser(user.email)
            //TODO: access via service layer
            const conversations:Conversation[] = await ConversationDAO.getConversationsByUserId(userObj.id)
            conversations.forEach(conv => {
                socket.join(conv.uuid)
            })
            console.log('Re-joining conversations')
        } 
        catch(e) {
            console.error(e)
        }
    }

}

export default clientListener
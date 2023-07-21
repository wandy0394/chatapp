import {Socket} from 'socket.io'
import {v4 as uuidv4} from 'uuid'
import { SystemMessage } from '../../types/message'
import parseCookieHeader from '../../util/parseCookieHeader'
import { ConversationService } from '../../services/conversationService'
import { User } from '../../types/user'
type Room = {
    [id:string]:string
}

declare module "http" {
    interface IncomingMessage {
        user: {
            email:string,
            sessionID:string
        },       
    }
}

let rooms:Room = {}
const conversationListener = (socket:Socket) => {
    const user = socket.request.user
    if (user === null || user === undefined) return
    console.log('user email is ' + user.email)
    ConversationService.createPublicConversation(socket, user.email)

    // socket.on("createPublicConversation", (message) => {
    //     console.log(`${message} wants to create a room`)
    //     const newRoomId = uuidv4()
    //     const name='Test ' + Math.floor(Math.random() * 100)
    //     rooms[newRoomId] = name
    //     console.log(rooms)
    //     const msg:SystemMessage = {
    //         content:JSON.stringify({id:newRoomId, name:name}),
    //         timestamp: (new Date().toJSON())
    //     }
    //     socket.emit("createPublicConversation", msg)
    // })

    ConversationService.getConversationByUserId(socket, user.email)
    // socket.on('getPublicConversations', ()=>{
    //     const msg:SystemMessage = {
    //         content:JSON.stringify(rooms),
    //         timestamp: (new Date().toJSON())
    //     }
    //     socket.emit('getPublicConversations', msg)
    // })

    ConversationService.joinRoom(socket)
    // socket.on('joinRoom', (conversationUUID:string)=>{
    //     console.log(conversationUUID)
    //     console.log(`${socket.id} joined room ${roomId}`)
    //     socket.join(roomId)
    //     // socket.emit('joinRoom', {
    //     //     content:JSON.stringify({id:roomId, name:rooms[roomId]}),
    //     //     timestamp:(new Date().toJSON())
    //     // })

    // })
}

export default conversationListener
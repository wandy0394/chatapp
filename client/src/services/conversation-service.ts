import { Socket } from "socket.io-client"
import { Message } from "../features/ChatMessages/types"
import { webSocket as socket } from "./util/socket"

export class ConversationService {
    static requestJoinRoom(roomId:string ) {
        socket.emit('joinRoom', roomId)
    }

    static listenOnJoinRoom(callback:(msg:Message)=>void) {
        socket.on('joinRoom', callback)
    }

    static removeJoinRoomListener(callback:any) {
        socket.off('joinRoom', callback)
    }

    static getConversationHistory(conversationUUID:string) {
        socket.emit('conversationHistory', conversationUUID)
    }

    static listenOnConversationHistory(callback:(msg:Message)=>void) {
        socket.on('conversationHistory', callback)
    }

    static removeConversationHistoryListener(callback:(msg:Message)=>void) {
        socket.off('conversationHistory', callback)
    }

    static createPublicConversation(label:string, addresseeEmail:string) {
        const message = JSON.stringify({
            label:label,
            addresseeEmail:addresseeEmail
        })
        if (socket.connected) {
            socket.emit('createPublicConversation', message)
        }
    }

    static listenOnCreatePublicConversation(callback:(msg:Message)=>void):Socket {
        socket.on('createPublicConversation', callback)
        return socket
    }
    static removeCreatePublicConversationListener(callback:any) {
        socket.off('createPublicConversation', callback)
    }

    //TODO:rename this
    static requestPublicConversations() {
        socket.emit('getPublicConversations')
    }

    static listenOnGetPublicConversations(callback:(msg:Message)=>void) {
        socket.on('getPublicConversations', callback)
    }

    static removeGetPublicConversationsListener(callback:any) {
        socket.off('getPublicConversations', callback)
    }

    static listenOnConversationInvitation(callback:any) {
        socket.on('conversationInvitation', callback)
    }
}
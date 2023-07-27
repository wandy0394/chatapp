import { Socket } from "socket.io-client"
import { Message } from "../features/ChatMessages/types"
import { webSocket as socket } from "./util/socket"
import request, { RESPONSE_TYPE, RequestError } from "./util/request";
import { ConversationResponse } from "./util/types";

const url = (import.meta.env.MODE === 'development')
                            ?'http://192.168.0.128:8080/api/v1/conversations'
                            :'https://app-library-dot-paletto-382422.ts.r.appspot.com/api/v1/contactList'

const headers = {
    "Accept" : "*",
    "Content-Type": "application/json",
};
const credentials = "include";

type ResponseObject<T> = {
    status:string,
    data:T
}

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

    static async getConversations() {
        const config:RequestInit = {
            method:'GET',
            headers:headers,
            credentials:credentials,
        }
        try {
            const response = await request<ResponseObject<ConversationResponse[]>>(`${url}`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }  
    }


    static listenOnConversationInvitation(callback:any) {
        socket.on('conversationInvitation', callback)
    }
}
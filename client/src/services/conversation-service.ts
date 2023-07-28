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


    static async createConversation(addresseeEmail:string) {
        const config:RequestInit = {
            method:'POST',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                addresseeEmail:addresseeEmail,
            })
        }

        try {
            const response = await request<ResponseObject<string>>(`${url}`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }

        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }        
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

    static async getConversationHistory(conversationUUID:string) {
        const config:RequestInit = {
            method:'GET',
            headers:headers,
            credentials:credentials,
        }
        try {
            const response = await request<ResponseObject<Message[]>>(`${url}/history/${conversationUUID}`, config)
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

    static removeConversationInvitationLisenter(callback:any) {
        socket.off('conversationInvitation', callback)
    }
}
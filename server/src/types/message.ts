import { User } from "./user";
export type MessageData  = {
    [key:string]:string
}

export type Message = {
    from:string
    message:string | MessageData
    id:string
}

export type ChatMessage = {
    author:User,
    content:string,
    timestamp:string,
    conversationRoomId:string
}

export type SystemMessage = {
    content:string,
    timestamp:string
}
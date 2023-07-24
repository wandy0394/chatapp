import { User } from "./user"

export type Conversation = {
    id:number,
    uuid:string,
    label:string
}

export type CreateConversationRequest = {
    label:string,
    owner: string,
    addressee?:string,
}

export type ConversationLine = {
    
}
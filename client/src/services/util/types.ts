import { Message } from "../../features/ChatMessages/types"

export type ServerToClientEvents = {
    joinRoom: (msg:Message) => void
    message: (msg:Message) => void
    createPublicConversation: (msg:Message) => void
    conversationInvitation: (msg:Message) => void
    conversationHistory: (msg:Message) => void
}

export type ClientToServerEvents = {
    //join room should try to join the room if it exists, otherwise create it then join it
    joinRoom: (room:string) => void 
    message: (msg:Message) => void
    createPublicConversation: (id:string) => void
    conversationInvitation: (room:string) => void
    conversationHistory:(conversationUUID:string) => void
}

export type ConversationResponse = {
    label:string,
    uuid:string,
    memberUUIDs:string[]
}
import { Message } from "../../features/ChatMessages/types"

export type ServerToClientEvents = {
    joinRoom: (msg:Message) => void
    message: (msg:Message) => void
    createPublicConversation: (msg:Message) => void
    getPublicConversations:(msg:Message) => void
    conversationInvitation: (msg:Message) => void
}

export type ClientToServerEvents = {
    //join room should try to join the room if it exists, otherwise create it then join it
    joinRoom: (room:string) => void 
    message: (msg:Message) => void
    createPublicConversation: (id:string) => void
    getPublicConversations: () => void
}


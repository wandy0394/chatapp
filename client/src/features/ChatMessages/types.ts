import { User } from "../Authentication/AuthContext"

export type Message = {
    author:User,
    conversationRoomId:string
    content:string,
    timestamp:string
}
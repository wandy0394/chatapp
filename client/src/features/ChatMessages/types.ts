import { User } from "../Authentication/AuthContext"

export type Message = {
    author:User,

    content:string,
    timestamp:string
}
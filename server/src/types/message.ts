import { User } from "./user";

export type Message = {
    author:User,
    content:string,
    timestamp:string
}
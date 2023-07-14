import { Response } from "express";
import { Message } from "../types/message";

type Clients = {
    [key:string] : Response
}

type MessageData = {
    [key:string] : string
}

//should this be in a database?
let clients:Clients = {}

export class NotificationService {
    static async register(email:string, res:Response):Promise<Response> {
        try {
            res.set({
                'Cache-Control':'no-cache',
                'Content-Type':'text/event-stream',
                'Connection' : 'keep-alive'
            })
            res.flushHeaders()
            clients[email as keyof Clients] = res
            return res
        }
        catch (e) {
            console.error(e)
            throw(e)
        }
    }

    static pushNotification(message:Message, email:string, eventType:string):boolean {
        if (!(email in clients)) {
            console.log('Client not registered')
            return false
        }
        clients[email].write(`event: ${eventType}\n`)
        clients[email].write(`from: ${message.from}\n`)
        clients[email].write(`id: ${message.id}\n`)
        clients[email].write(`data: ${JSON.stringify(message)}\n\n`)
        return true
    }
}
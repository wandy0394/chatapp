import { Response } from "express";

type Clients = {
    [key:string] : Response
}
let clients:Clients = {}
export class NotificationService {
    static async register(email:string, res:Response):Promise<Response> {
        console.log(email)
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

    static pushNotification(message:string, email:string, eventType:string):boolean {
        if (email in clients) {
            clients[email].write(`event: ${eventType}\n`)
            clients[email].write(`data: ${message}\n\n`)
            return true
        }
        else {
            console.log('Client not registered')
        }
        return false
    }
}
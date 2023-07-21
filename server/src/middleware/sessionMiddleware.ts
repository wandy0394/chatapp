import sessions, {Session} from 'express-session'
import dotenv from 'dotenv'
import {Socket} from 'socket.io'
import { NextFunction, Response, Request } from 'express'

dotenv.config()


const sessionMiddleware = sessions({
    secret:process.env.SESSION_SECRET as string,
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000*60*60*24*3,
        sameSite: process.env.NODE_ENV === 'production'?'none':'lax',
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production'
    }
})

const wrap = (middleware:Function) => 
    (socket:Socket, next:Function) => 
        middleware(socket.request as Request, {} as Response, next as NextFunction)

export {sessionMiddleware, wrap}
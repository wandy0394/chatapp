import express, { Express, Request, Response } from 'express'
import userRouter from './v1/routes/users.routes'
import contactListRouter from './v1/routes/contactList.routes'
import notificationRouter from './v1/routes/notification.routes'
import cors from 'cors'
import helmet from 'helmet'
import sessions from 'express-session'
import dotenv from 'dotenv'

dotenv.config()


const app:Express = express()
const allowedOrigins = ['http://192.168.0.128:5173']

app.use(cors({
    //By default, Access-Control-Allow-Origin is *. This cannot be * for credentials to pass through
    // Refer to error 'Reason: Credential is not supported if the CORS header 'Access-Control-Allow-Origin' is *
    origin:function(origin, callback) {
        if (!origin) return callback(null, true)
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg:string = 'The CORS Policy of this site does not allow access from specified Origin.'
            return callback(new Error(msg), false);
        }
        return callback(null, true)
    },
    credentials:true,    //allow HTTP cookies and credentials from the client
}))
app.use(express.json())
app.use(helmet())
app.use(sessions({
    secret:process.env.SESSION_SECRET as string,
    resave:false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000*60*60*24*3,
        sameSite: process.env.NODE_ENV === 'production'?'none':'lax',
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production'
    }
}))
app.use('/api/v1/users', userRouter)
app.use('/api/v1/contactList', contactListRouter)
app.use('/api/v1/notifications', notificationRouter)
app.use("*", (req:Request, res:Response) => {
    res.status(404).json({error:'Invalid endpoint url'})
})

// export {httpServer}
export default app
import {Request, Response, NextFunction} from 'express'
import UserService from '../services/userService'
import parseCookieHeader from '../util/parseCookieHeader'



export default async function requireAuth(req:Request, res:Response, next:NextFunction) {

    const sid = parseCookieHeader(req.headers?.cookie).sid
    if (!sid) return res.status(403).json({status:'error', data:{error:'Unauthorised.'}})
    try {      
        const result = await UserService.getSessionBySessionId(sid)
        if (Object.keys(result).length > 0) {
            req.body.id= result.id
            req.body.email=result.email
            req.body.sessionID=sid
        }
        next()
    }
    catch(e) {
        console.log(e)
        res.status(403).json({status:'error', data:{error:'Unauthorised.'}})
    }
}

export async function requireAuth2(req:Request, res:Response, next:NextFunction) {

    const sid = parseCookieHeader(req.headers?.cookie).sid
    if (!sid) next(new Error('Unauthorised'))
    try {      
        const result = await UserService.getSessionBySessionId(sid)
        if (Object.keys(result).length > 0) {
            req.user = {
                email:result.email,
                sessionID:sid
            }
        }
        next()
    }
    catch(e) {
        console.log(e)
        next(new Error('Unauthorised'))
    }
}


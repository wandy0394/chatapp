import {Request, Response, NextFunction, CookieOptions} from 'express'
// import UserService from '../services/userService'
// import parseCookieHeader from '../util/parseCookieHeader'

class UserController {

    static cookieParameters:CookieOptions = {
        maxAge: 1000*60*60*24*3,
        sameSite: process.env.NODE_ENV === 'production'?'none':'lax',
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production'
    }


    static userCookieParams:CookieOptions = {
        maxAge: 1000*60*60*24*3,
        sameSite: process.env.NODE_ENV === 'production'?'none':'lax',
        httpOnly:false,
        secure: process.env.NODE_ENV === 'production'
    }

    static async signup(req:Request, res:Response, next:NextFunction) {
        const {email, password, name} = req.body
        if (!email) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing email field'}})
            return
        }
        if (!password) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing password field'}})
            return
        }
        if (!name) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing name field'}})
            return
        }
        try {
            // const user = await UserService.signup(email, password, name)
            // await UserService.addSession(req.sessionID, user.email, user.id)
            let user = {
                name:name
            }
            res.cookie('user', JSON.stringify({name:user.name}), UserController.userCookieParams)
            res.cookie('sid', req.sessionID, req.session.cookie as CookieOptions).status(200).send({status:'ok', data:{user:{name:user.name}}})
        }
        catch(error) {
            if (error instanceof Error) {
                console.log(error.message)
                res.status(500).send({status:'error', data:{error:error.message}})
            }
            else {
                console.log(error)
                res.status(500).send({status:'error', data:{error:'Internal Server Error'}})
            }
        }
    }

    static async login(req:Request, res:Response, next:NextFunction) {
        const {email, password} = req.body
        if (!email) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing email field'}})
            return
        }
        if (!password) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing password field'}})
            return
        }
        try {
            // const user = await UserService.login(email, password)
            // await UserService.addSession(req.sessionID, user.email, user.id)
            let user = {
                name:name
            }
            res.cookie('user', JSON.stringify({name:user.name}), UserController.userCookieParams)
            res.cookie('sid', req.sessionID, req.session.cookie as CookieOptions).status(200).send({status:'ok', data:{user:{name:user.name}}})
        }
        catch(error:any) {
            if (error instanceof Error) {
                console.error(error)
                res.status(500).send({status:'error', data:{error:error.message}})
            }
            else {
                console.log(error)
                res.status(500).send({status:'error', data:{error:'Internal Server Error'}})
            }
        }
    }
    static async getUser(req:Request, res:Response, next:NextFunction) {
        const {email} = req.body
        if (!email) {
            res.status(400).send({status:'error', data:{error:'Bad request: Missing email field'}})
            return
        }
        try {
            // const user = await UserService.getUser(email)
            let user = {
                name:name,
                email:email
            }
            res.status(200).send({status:'ok', data:{user:{email:user.email, name:user.name}}})
        }
        catch(e:any) {
            console.log
            if (e.message) {
                res.status(500).send({status:'error', data:{error:e.message}})
            }
            else {
                console.log(e)
                res.status(500).send({status:'error', data:{error:'Internal Server Error'}})
            }
        }        
    }

    static async logout(req:Request, res:Response, next:NextFunction) {
        // const cookies = parseCookieHeader(req.headers?.cookie)
        // if (cookies.sid) await UserService.deleteSessionBySessionId(cookies.sid)
        res.clearCookie('user')
        res.clearCookie('sid')
        res.status(200).send({status:'ok', data:'Logout successsful'})
    }

    static async getUserBySession(req:Request, res:Response, next:NextFunction) {
        // const cookies = parseCookieHeader(req.headers?.cookie)
        // if (!cookies.sid) {
        //     res.status(403).send({status:'error', data:{error:'Unauthorised.'}})
        //     return
        // }
        // try {
        //     const session = await UserService.getSessionBySessionId(cookies.sid)
        //     const user = await (UserService.getUser(session.userEmail))
        //     res.status(200).send({status:'ok', data:{user:{email:user.email, name:user.name}}})
            
        // }
        // catch (e) {
        //     res.status(403).send({status:'error', data:{error:'Unauthorised.'}})
        //     return
        // }
    }
}

export default UserController
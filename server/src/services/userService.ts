import {Connection} from "mysql2"
import UsersDAO from "../database/usersDAO"
import SessionsDAO from "../database/sessionsDAO"
import {User} from '../types/user'
import {Session} from '../types/session'
import bcrypt from "bcrypt"
// import SessionsDAO from "../database/sessionsDAO"
class UserService {

    static injectConn(connection:Connection) {
        UsersDAO.initDb(connection)
    }
    
    static connectionCheck() {
        UsersDAO.checkConnection()
    }

    static async signup(email:string, password:string, name:string):Promise<User> {
        try {
            const userExists = await UsersDAO.userExists(email)
            if (userExists) {
                throw new Error('User already exists')
            }
            else {
                const result = await UsersDAO.signup(email, password, name)
                return result
            }
        }
        catch(e) {
            throw(e)
        }
    }

    static async login(email:string, password:string):Promise<User> {
        
        try {
            const user = await UsersDAO.getOneUser(email)
            if (user && user.passwordHash) {
                const passwordMatched = await bcrypt.compare(password, user.passwordHash)
                if (!passwordMatched) throw Error('Invalid credentials.')
                const retUser:User = {...user}
                retUser.passwordHash=undefined
                return retUser
            }
            else {
                throw new Error(`User with email ${email} not found`)
            }
        }
        catch(e) {
            throw (e)
        }
    }

    static async getUser(email:string):Promise<User> {
        try {
            const result = await UsersDAO.getUser(email)
            return result
        }
        catch (e) {
            throw(e)
        }
    }

    static async addSession(sid:string, userEmail:string, userId:number):Promise<boolean> {
        try {
            const result = await SessionsDAO.addSession(sid, userEmail, userId)
            return result
        }
        catch(e) {
            throw(e)
        }
    }

    static async getSessionBySessionId(sid:string):Promise<Session> {
        try {
            const result = await SessionsDAO.getSessionBySessionId(sid)
            return result
        }
        catch(e) {
            throw(e)
        }
    }

    static async deleteSessionBySessionId(sid:string):Promise<boolean> {
        try {
            const result = await SessionsDAO.deleteSessionBySessionId(sid)
            return result
        }
        catch(e) {
            throw(e)
        }
    }

}

export default UserService

import app from './server'
import dotenv from 'dotenv'
import {httpServer} from './server'
import mysql, {Connection}  from 'mysql2'
import UserService from './services/userService'

dotenv.config()

const port = process.env.PORT || 8000
const chatPort = process.env.CHAT_PORT || 3000

// let connection:Connection = mysql2.createConnection({
//     host: process.env.DB_HOST,
//     port: parseInt(process.env.DB_PORT as string),
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_DB,
//     multipleStatements:true,
// })
const connection = mysql.createConnection(process.env.DATABASE_URL as string)
connection.connect((err)=>{
    if (err) {
        console.error('Could not connect to SQL database')
        console.error(err)
    }
    // LibraryService.injectConn(connection)
    UserService.injectConn(connection)
    UserService.connectionCheck()
    // LibraryService.connectionCheck()
})



httpServer.listen(chatPort, ()=>{
    console.log(`Listening for socket connections on port ${chatPort}`)
})
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})


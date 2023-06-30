import app from './server'
import dotenv from 'dotenv'
import {httpServer} from './server'

dotenv.config()

const port = process.env.PORT || 8000
const chatPort = process.env.CHAT_PORT || 3000

httpServer.listen(chatPort, ()=>{
    console.log(`Listening for socket connections on port ${chatPort}`)
})
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})


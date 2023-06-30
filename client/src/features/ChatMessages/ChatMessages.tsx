import { Message } from "./types"
import { socket } from "../../services/chat-service"
import { useEffect } from "react"

export default function ChatMessages() {
    const messages:Message[] = []
    useEffect(()=>{
        socket.connect();
        socket.on("message", (msg)=>{
            console.log(msg)
        })
        return ()=>{
            socket.disconnect()
        }
    }, [])
    return (
        <div className='w-full h-full border border-black p-4'>

        </div>
    )
}
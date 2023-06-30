import { Message } from "./types"
import { socket } from "../../services/chat-service"
import { useEffect, useState } from "react"

function parseMessage(msg:any):Message {
    let output:Message = {
        author:'anon',
        content:msg,
        date:new Date(),
    }

    return output
}

export default function ChatMessages() {
    const [messages, setMessages] = useState<Message[]>([])
    useEffect(()=>{
        // socket.connect();
        socket.on("message", (msg)=>{
            console.log(msg)
            setMessages((state)=>[...state, parseMessage(msg)])
        })
        return ()=>{
            socket.off("message")
        }
    }, [])
    return (
        <div className='w-full h-full border border-black p-4 flex flex-col gap-4'>
            {
                messages.map((message, index) => {
                    return (
                        <div>
                            {message.content}
                        </div>
                    )
                })
            }
        </div>
    )
}
import { Message } from "./types"
import { socket } from "../../services/chat-service"
import { useEffect, useState } from "react"
import ChatBubble from "./ChatBubble"

function parseMessage(msg:any):Message {
    let output:Message = {
        author:'anon',
        content:msg,
        timestamp:'00:12',
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
                        <ChatBubble content={message.content} author={message.author} timestamp={message.timestamp} status={""} isSelf={index%2==0}/>
                    )
                })
            }
        </div>
    )
}
import { Message } from "./types"
import { socket } from "../../services/chat-service"
import { useEffect, useState } from "react"
import ChatBubble from "./ChatBubble"
import { useAuthContext } from "../Authentication/useAuthContext"

function parseMessage(msg:Message):Message {
    console.log(msg)

    return msg
}

export default function ChatMessages() {
    const [messages, setMessages] = useState<Message[]>([])
    const {user} = useAuthContext()
    useEffect(()=>{
        // socket.connect();
        socket.on("message", (msg:Message)=>{
            console.log(msg)
            setMessages((state)=>[...state, parseMessage(msg)])
        })
        return ()=>{
            socket.off("message")
        }
    }, [])
    return (
        <div className='w-full h-full border border-black p-4 flex flex-col gap-4'>
            {user && user.userUUID}
            {
                user &&
                    messages.map((message, index) => {
                        return (
                            <ChatBubble 
                                content={message.content} 
                                author={message.author.username} 
                                timestamp={message.timestamp} 
                                status={""} 
                                isSelf={user.userUUID === message.author.userUUID}
                            />
                        )
                    })
            }
        </div>
    )
}
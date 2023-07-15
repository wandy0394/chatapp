import { useState, useEffect } from "react"
import { socket } from "../../../services/chat-service"
import { Message } from "../types"

function parseMessage(msg:Message):Message {
    return msg
}

export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(true)



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

    return {messages, setMessages}
}
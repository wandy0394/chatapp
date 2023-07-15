import { useState, useEffect } from "react"
import { Message } from "../types"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"
import { ChatService } from "../../../services/chat-service"
function parseMessage(msg:Message):Message {
    return msg
}

export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const {user} = useAuthContext()


    const messageLisener = (msg:Message) => {
        console.log(msg)
        setMessages((state)=>[...state, parseMessage(msg)])
    }

    useEffect(()=>{
        if (user === null) return
        ChatService.listenOnMessage(messageLisener)

        return ()=>{
            ChatService.removeMessageListener(messageLisener)
        }
    }, [user])

    return {messages, setMessages}
}
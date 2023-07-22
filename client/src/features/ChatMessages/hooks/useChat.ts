import { useState, useEffect } from "react"
import { Message } from "../types"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"
import { ChatService } from "../../../services/chat-service"
import { useConversationContext } from "../../Conversations/hooks/useConversationContext"
import { Conversation } from "../../Conversations/types"
function parseMessage(msg:Message):Message {
    return msg
}

export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const {user} = useAuthContext()
    const {currentConversation, conversationList, setConversationList} = useConversationContext()


    const messageLisener = (msg:Message) => {
        if (msg.conversationRoomId === currentConversation?.id) {
            setMessages((state)=>[...state, parseMessage(msg)])
        }
        else {
            console.log('new message but not displayed')
            const newConversationList:Conversation[] = conversationList.map(conv => {
                if (conv.id === msg.conversationRoomId) {
                    return {
                        id:conv.id,
                        label:conv.label,
                        hasUnreadMessages:true
                    }
                }
                return conv
            })
            setConversationList(newConversationList)
        }
    }

    useEffect(()=>{
        if (user === null) return
        ChatService.listenOnMessage(messageLisener)

        return ()=>{
            ChatService.removeMessageListener(messageLisener)
        }
    }, [user, currentConversation, conversationList])

    return {messages, setMessages}
}
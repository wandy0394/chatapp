import { useState, useEffect } from "react"
import { Message } from "../types"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"
import { ChatService } from "../../../services/chat-service"
import { useConversationContext } from "../../Conversations/hooks/useConversationContext"
import { Conversation } from "../../Conversations/types"
import { webSocket } from "../../../services/util/socket"
function parseMessage(msg:Message):Message {
    return msg
}

export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const {user} = useAuthContext()
    const {currentConversation, conversationList, setConversationList, joinRoom} = useConversationContext()


    const messageLisener = (msg:Message) => {
        if (msg.conversationRoomId === currentConversation?.uuid) {
            setMessages((state)=>[...state, parseMessage(msg)])
        }
        else {
            console.log('new message but not displayed')
            let conversationFound:boolean = conversationList.findIndex(c=>c.uuid===msg.conversationRoomId) > -1
            if (conversationFound) {
                console.log('conversation found')
                const newConversationList:Conversation[] = conversationList.map(conv => {
                    if (conv.uuid === msg.conversationRoomId) {
                        return {
                            uuid:conv.uuid,
                            label:conv.label,
                            hasUnreadMessages:true,
                            memberUUIDs:conv.memberUUIDs
                        }
                    }
                    return conv
                })
                setConversationList(newConversationList)
            }
            else {
                console.log('conversation not found, requesting')
                // joinRoom(msg.conversationRoomId)
                webSocket.emit('conversationInvitation', msg.conversationRoomId)
            }
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
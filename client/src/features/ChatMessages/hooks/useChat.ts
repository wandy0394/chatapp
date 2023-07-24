import { useState, useEffect } from "react"
import { Message } from "../types"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"
import { ChatService } from "../../../services/chat-service"
import { useConversationContext } from "../../Conversations/hooks/useConversationContext"
import { Conversation } from "../../Conversations/types"
import { webSocket } from "../../../services/util/socket"
import { ConversationService } from "../../../services/conversation-service"
function parseMessage(msg:Message):Message {
    return msg
}

const DEFAULT_MSG:Message = {
    author: {
        username:'CatCat',
        userUUID:'516ae3c4-0553-4dde-b499-0d96cf1f7624',
        email:'cat@cat.com'
    },
    content:'hello dog',
    conversationRoomId: "06215c08-ca72-408b-b201-576d9c2a2c3c",
    timestamp:'2023-07-24T11:36:42.000Z'
}

//TODO: convert this to context??
export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const {user} = useAuthContext()
    const {currentConversation, conversationList, setConversationList, joinRoom} = useConversationContext()


    const conversationHistoryListener = (msg:Message) => {
        console.log(JSON.parse(msg.content))
        const history = (JSON.parse(msg.content)).reverse()
        setMessages(history)
    }


    const messageListener = (msg:Message) => {
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
        ChatService.listenOnMessage(messageListener)
        ConversationService.listenOnConversationHistory(conversationHistoryListener)

        return ()=>{
            ConversationService.removeConversationHistoryListener(conversationHistoryListener)
            ChatService.removeMessageListener(messageListener)
        }
    }, [user, currentConversation, conversationList, messageListener, conversationHistoryListener])

    return {messages, setMessages}
}
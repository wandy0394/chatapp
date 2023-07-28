import { createContext, useState, useEffect } from "react"
import { Message } from "../../ChatMessages/types"
import { Conversation } from "../types"
import { ConversationService } from "../../../services/conversation-service"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"
import { ChatService } from "../../../services/chat-service"
import { webSocket } from "../../../services/util/socket"

type ContextType = {
    currentConversation:Conversation | null, 
    setCurrentConversation: React.Dispatch<React.SetStateAction<Conversation | null>>
    conversationList:Conversation[],
    setConversationList:React.Dispatch<React.SetStateAction<Conversation[]>>
    getConversations:()=>void,
    joinRoom: (conversationUUID:string)=>void,
    leaveRoom: (conversationUUID:string) => void
    messages:Message[],
    setMessages:React.Dispatch<React.SetStateAction<Message[]>>
    getConversationHistory:(conversationUUID:string)=>void
}

export const ConversationContext = createContext<ContextType>({
    messages:[],
    setMessages:Function.prototype(),
    currentConversation: null, 
    setCurrentConversation:Function.prototype(),
    conversationList: [],
    setConversationList:Function.prototype(),
    getConversations: Function.prototype(), 
    joinRoom:Function.prototype(), 
    leaveRoom:Function.prototype(),
    getConversationHistory:Function.prototype(),
})


export const ConversationContextProvider = ({children}:any) => {
    const [messages, setMessages] = useState<Message[]>([])
    
    const [conversationList, setConversationList] = useState<Conversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const {user} = useAuthContext()

    useEffect(()=>{
        console.log(currentConversation)
    }, [currentConversation])

    function getConversationHistory(conversationUUID:string) {
        ConversationService.getConversationHistory(conversationUUID)
            .then(response=>{
                if (response) {
                    setMessages(response.reverse())
                }
            })
            .catch(error=>{
                console.error(error)
            })
    }

    function joinRoom(conversationUUID:string) {
        if (user === null) return
        ConversationService.requestJoinRoom(conversationUUID)
    }

    function leaveRoom(conversationUUID:string) {
        if (conversationUUID === undefined || conversationUUID === null || conversationUUID === '') return
        ConversationService.leaveConversation(conversationUUID)
            .then(response=>{
                if (response === 'success') {
                    if (currentConversation?.uuid === conversationUUID) {
                        setCurrentConversation(null)
                    }
                    const newConversationList =[...conversationList].filter(c=>c.uuid !== conversationUUID)
                    setConversationList(newConversationList)
                    
                }
            })
            .catch(error=>{
                console.error(error)
            })
    }
    
    const joinRoomListener = (msg:Message) => {
        console.log(msg)
        const msgData = JSON.parse(msg.content) 
        const conv:Conversation = {
            uuid:msgData.uuid,
            label:msgData.label,
            hasUnreadMessages:false,
            memberUUIDs:msgData.memberUUIDs,
            memberEmails:msgData.memberEmails
        }
        setCurrentConversation(conv)
    }

    function getConversations() {
        ConversationService.getConversations()
            .then(response=>{
                console.log(response)
                if (response === null || response === undefined) return
                let newConversations:Conversation[] = []
                newConversations = response.map(key=>{
                    return {
                        uuid:key.uuid,
                        label:key.label,
                        hasUnreadMessages:false,
                        memberUUIDs:key.memberUUIDs,
                        memberEmails:key.memberEmails
                    }
                })
                setConversationList(newConversations)
            })
            .catch(error=>{
                console.log(error)
            })
    }

    const conversationInvitationListener = (msg:Message) => {
        console.log(JSON.parse(msg.content))
        let msgContent = JSON.parse(msg.content)
        let newConversation:Conversation = {
            uuid:msgContent.uuid,
            label:msgContent.label,
            hasUnreadMessages:true,
            memberUUIDs:msgContent.memberUUIDs,
            memberEmails:msgContent.memberEmails,
        }
        console.log('Got invitation')
        let conversationFound:boolean = conversationList.findIndex(c=>c.uuid===msgContent.uuid) > -1
        if (!conversationFound) setConversationList(prev=>[...prev, newConversation])        
    }


    function handleUnknownMessage(msg:Message) {
        let conversationFound:boolean = conversationList.findIndex(c=>c.uuid===msg.conversationRoomId) > -1
        if (conversationFound) {
            console.log('conversation found')
            const newConversationList:Conversation[] = conversationList.map(conv => {
                if (conv.uuid === msg.conversationRoomId) {
                    return {
                        uuid:conv.uuid,
                        label:conv.label,
                        hasUnreadMessages:true,
                        memberUUIDs:conv.memberUUIDs,
                        memberEmails:conv.memberEmails
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

    const messageListener = (msg:Message) => {
        if (msg.conversationRoomId === currentConversation?.uuid) {
            setMessages((state)=>[...state, (msg)])
        }
        else {
            handleUnknownMessage(msg)
        }
    }

    useEffect(()=>{
        if (user === null || user === undefined) return
        ConversationService.listenOnJoinRoom(joinRoomListener)
        ConversationService.listenOnConversationInvitation(conversationInvitationListener)
        ChatService.listenOnMessage(messageListener)

        
        return ()=>{
            ConversationService.removeJoinRoomListener(joinRoomListener)
            ConversationService.removeConversationInvitationLisenter(conversationInvitationListener)
            ChatService.removeMessageListener(messageListener)

        }
    }, [user, currentConversation, conversationList])


    useEffect(()=>{
        if (user === null || user === undefined) return
        getConversations()
    }, [user])

    return (
        <ConversationContext.Provider 
            value ={{
                messages,
                setMessages,
                currentConversation,
                setCurrentConversation,
                conversationList,
                setConversationList,
                joinRoom,
                leaveRoom,
                getConversations,
                getConversationHistory
            }}
        >
            {children}
        </ConversationContext.Provider>
    )
}
import { createContext, useState, useEffect } from "react"
import { Message } from "../../ChatMessages/types"
import { Conversation } from "../types"
import { ConversationService } from "../../../services/conversation-service"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"
import { ChatService } from "../../../services/chat-service"
import { webSocket } from "../../../services/util/socket"

type ContextType = {
    currentConversation:Conversation | null, 
    createPublicConversation:(label:string, addresseeEmail:string)=>void, 
    conversationList:Conversation[],
    setConversationList:React.Dispatch<React.SetStateAction<Conversation[]>>
    getConversations:()=>void,
    joinRoom: (roomId:string)=>void,
    messages:Message[],
    setMessages:React.Dispatch<React.SetStateAction<Message[]>>
    getConversationHistory:(conversationUUID:string)=>void
}

export const ConversationContext = createContext<ContextType>({
    messages:[],
    setMessages:Function.prototype(),
    currentConversation: null, 
    createPublicConversation:Function.prototype(), 
    conversationList: [],
    setConversationList:Function.prototype(),
    getConversations: Function.prototype(), 
    joinRoom:Function.prototype(), 
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

    function joinRoom(roomId:string) {
        if (user === null) return
        ConversationService.requestJoinRoom(roomId)
    }

    function createPublicConversation(label:string, addresseeEmail:string) {
        if (user === null) return
        ConversationService.createPublicConversation(label, addresseeEmail)
    }
    
    const joinRoomListener = (msg:Message) => {
        console.log(msg)
        const msgData = JSON.parse(msg.content) 
        const conv:Conversation = {
            uuid:msgData.uuid,
            label:msgData.label,
            hasUnreadMessages:false,
            memberUUIDs:msgData.memberUUIDs.split(','),
        }
        setCurrentConversation(conv)
    }

    const createPublicConversationListener = (msg:Message) => {
        console.log(msg)
        const msgContent =JSON.parse(msg.content)
        const newConversation:Conversation = {
            uuid:msgContent.uuid,
            label:msgContent.label,
            hasUnreadMessages:false,
            memberUUIDs:msgContent.memberUUIDs.split(',')
        }
        setConversationList(prev=>[...prev, newConversation])
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
                        memberUUIDs:key.memberUUIDs
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
            memberUUIDs:msgContent.memberUUIDs.split(',')
        }
        console.log('Got invitation')
        setConversationList(prev=>[...prev, newConversation])        
    }

    const messageListener = (msg:Message) => {
        if (msg.conversationRoomId === currentConversation?.uuid) {
            setMessages((state)=>[...state, (msg)])
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
        ConversationService.listenOnJoinRoom(joinRoomListener)
        ConversationService.listenOnCreatePublicConversation(createPublicConversationListener)
        ConversationService.listenOnConversationInvitation(conversationInvitationListener)
        ChatService.listenOnMessage(messageListener)

        getConversations()
        
        return ()=>{
            ConversationService.removeJoinRoomListener(joinRoomListener)
            ConversationService.removeCreatePublicConversationListener(createPublicConversationListener)
            ChatService.removeMessageListener(messageListener)

        }
    }, [user, currentConversation])

    return (
        <ConversationContext.Provider 
            value ={{
                messages,
                setMessages,
                currentConversation,
                conversationList,
                setConversationList,
                joinRoom,
                getConversations,
                createPublicConversation,
                getConversationHistory
            }}
        >
            {children}
        </ConversationContext.Provider>
    )
}
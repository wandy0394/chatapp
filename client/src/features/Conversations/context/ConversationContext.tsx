import { createContext, useState, useEffect } from "react"
import { Message } from "../../ChatMessages/types"
import { Conversation } from "../types"
import { ConversationService } from "../../../services/conversation-service"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"

type ContextType = {
    currentConversation:Conversation | null, 
    createPublicConversation:()=>void, 
    conversationList:Conversation[],
    getPublicConversations:()=>void,
    joinRoom: (roomId:string)=>void

}

export const ConversationContext = createContext<ContextType>({
    currentConversation: null, 
    createPublicConversation:Function.prototype(), 
    conversationList: [],
    getPublicConversations: Function.prototype(), 
    joinRoom:Function.prototype(), 
})


export const ConversationContextProvider = ({children}:any) => {
    const [conversationList, setConversationList] = useState<Conversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const {user} = useAuthContext()

    function joinRoom(roomId:string) {
        if (user === null) return
        ConversationService.requestJoinRoom(roomId)
    }

    function createPublicConversation() {
        if (user === null) return
        ConversationService.createPublicConversation()
    }

    function getPublicConversations() {
        if (user === null) return
        ConversationService.requestPublicConversations()
    }
    
    const joinRoomListener = (msg:Message) => {
        console.log(msg)
        const msgData = JSON.parse(msg.content) 
        const conv:Conversation = {
            id:msgData.id,
            name:msgData.name
        }
        setCurrentConversation(conv)
    }

    const createPublicConversationListener = (msg:Message) => {
        console.log(msg)
        const newConversation:Conversation = {
            id:JSON.parse(msg.content).id,
            name:JSON.parse(msg.content).name
        }
        setConversationList(prev=>[...prev, newConversation])
    }

    const getPublicConversationsListener = (msg:Message) => {
        console.log(JSON.parse(msg.content))
        let msgContent = JSON.parse(msg.content)
        let newConversations:Conversation[] = []
        newConversations =  Object.keys(msgContent).map(key=>{
            return {
                id:key,
                name:msgContent[key]
            }
        })
        setConversationList(newConversations)
    }

    useEffect(()=>{
        if (user === null) return
        ConversationService.listenOnJoinRoom(joinRoomListener)
        ConversationService.listenOnCreatePublicConversation(createPublicConversationListener)
        ConversationService.listenOnGetPublicConversations(getPublicConversationsListener)
        ConversationService.requestPublicConversations()
        
        return ()=>{
            ConversationService.removeJoinRoomListener(joinRoomListener)
            ConversationService.removeCreatePublicConversationListener(createPublicConversationListener)
            ConversationService.removeGetPublicConversationsListener(getPublicConversationsListener)
        }
    }, [user])

    return (
        <ConversationContext.Provider 
            value ={{
                currentConversation,
                conversationList,
                joinRoom,
                getPublicConversations,
                createPublicConversation
            }}
        >
            {children}
        </ConversationContext.Provider>
    )
}
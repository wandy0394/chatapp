import { createContext, useState, useEffect } from "react"
import { Message } from "../../ChatMessages/types"
import { Conversation } from "../types"
import { ConversationService } from "../../../services/conversation-service"
import { useAuthContext } from "../../Authentication/hooks/useAuthContext"

type ContextType = {
    currentConversation:Conversation | null, 
    createPublicConversation:(label:string, addresseeEmail:string)=>void, 
    conversationList:Conversation[],
    setConversationList:React.Dispatch<React.SetStateAction<Conversation[]>>
    getPublicConversations:()=>void,
    joinRoom: (roomId:string)=>void

}

export const ConversationContext = createContext<ContextType>({
    currentConversation: null, 
    createPublicConversation:Function.prototype(), 
    conversationList: [],
    setConversationList:Function.prototype(),
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

    function createPublicConversation(label:string, addresseeEmail:string) {
        if (user === null) return
        ConversationService.createPublicConversation(label, addresseeEmail)
    }

    function getPublicConversations() {
        if (user === null) return
        ConversationService.requestPublicConversations()
    }
    
    const joinRoomListener = (msg:Message) => {
        console.log(msg)
        const msgData = JSON.parse(msg.content) 
        const conv:Conversation = {
            uuid:msgData.uuid,
            label:msgData.label,
            hasUnreadMessages:false,
            memberUUIDs:msgData.memberUUIDs.split(',')
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

    const getPublicConversationsListener = (msg:Message) => {
        console.log(JSON.parse(msg.content))
        let msgContent = JSON.parse(msg.content)
        let newConversations:Conversation[] = []
        newConversations =  Object.keys(msgContent).map(key=>{
            console.log(msgContent[key].memberUUIDs.split(','))

            return {
                uuid:msgContent[key].uuid,
                label:msgContent[key].label,
                hasUnreadMessages:false,
                memberUUIDs:msgContent[key].memberUUIDs.split(',')
            }
        })
        setConversationList(newConversations)
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

    useEffect(()=>{
        if (user === null) return
        ConversationService.listenOnJoinRoom(joinRoomListener)
        ConversationService.listenOnCreatePublicConversation(createPublicConversationListener)
        ConversationService.listenOnGetPublicConversations(getPublicConversationsListener)
        ConversationService.requestPublicConversations()
        ConversationService.listenOnConversationInvitation(conversationInvitationListener)
        
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
                setConversationList,
                joinRoom,
                getPublicConversations,
                createPublicConversation
            }}
        >
            {children}
        </ConversationContext.Provider>
    )
}
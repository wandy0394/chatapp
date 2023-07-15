import { createContext, useState, useEffect } from "react"
import { socket } from "../../../services/chat-service"
import { Message } from "../../ChatMessages/types"
import { Conversation } from "../types"

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
    joinRoom:(roomId:string)=>Function.prototype(), 
})

export const ConversationContextProvider = ({children}:any) => {
    const [conversationList, setConversationList] = useState<Conversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    function joinRoom(roomId:string) {
        if (socket.connected) {
            socket.emit('joinRoom', roomId)
        }
    }

    function createPublicConversation() {
        if (socket.connected) {
            socket.emit('createPublicConversation', socket.id)
        }
    }

    function getPublicConversations() {
        socket.emit('getPublicConversations')
    }
    

    useEffect(()=>{
        // socket.connect();

        socket.on('joinRoom', (msg:Message)=>{
            console.log(msg)
            const msgData = JSON.parse(msg.content) 
            const conv:Conversation = {
                id:msgData.id,
                name:msgData.name
            }
            setCurrentConversation(conv)
        })
        

        socket.on('createPublicConversation', (msg:Message)=>{
            console.log(msg)
            const newConversation:Conversation = {
                id:JSON.parse(msg.content).id,
                name:JSON.parse(msg.content).name
            }
            setConversationList(prev=>[...prev, newConversation])
        })

        socket.on('getPublicConversations', (msg:Message) => {
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
        })

        socket.emit('getPublicConversations')
        return ()=>{
            socket.off("message")
            socket.off("createPublicConversation")
            socket.off('getPublicConversations')
            socket.off('joinRoom')
        }
    }, [])

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
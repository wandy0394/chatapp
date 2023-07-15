import { useState, useEffect } from "react"
import { socket } from "../../../services/chat-service"
import { Message } from "../../ChatMessages/types"
import { Conversation } from "../types"

function parseMessage(msg:Message):Message {
    return msg
}

export default function useConversations() {
    const [conversationList, setConversationList] = useState<Conversation[]>([])
    const [currentConversation, setCurrentConversation] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    function joinRoom(room:string) {
        if (socket.connected) {
            socket.emit('joinRoom', room)
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
            setCurrentConversation(msg.content)
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
        }
    }, [])

    return {currentConversation, createPublicConversation, conversationList, getPublicConversations}
}
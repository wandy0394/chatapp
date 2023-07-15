import { useState, useEffect } from "react"
import { socket } from "../../../services/chat-service"
import { Message } from "../types"

function parseMessage(msg:Message):Message {
    return msg
}

export default function useChat() {

    const [messages, setMessages] = useState<Message[]>([])
    const [currentRoom, setCurrentRoom] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    function joinRoom(room:string) {
        if (socket.connected) {
            socket.emit('joinRoom', room)
        }
    }

    function createPublicRoom() {
        if (socket.connected) {
            socket.emit('createPublicRoom', socket.id)
        }
    }

    useEffect(()=>{
        // socket.connect();
        socket.on("message", (msg:Message)=>{
            console.log(msg)
            setMessages((state)=>[...state, parseMessage(msg)])
        })

        socket.on('joinRoom', (msg:Message)=>{
            console.log(msg)
            setCurrentRoom(msg.content)
        })

        socket.on('createPublicRoom', (msg:Message)=>{
            console.log(msg)
        })
        return ()=>{
            socket.off("message")
            socket.off("joinRoom")
            socket.off("createPublicRoom")
        }
    }, [])

    return {messages, setMessages, currentRoom, createPublicRoom}
}
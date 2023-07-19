import { Message } from "./types"
import { useEffect } from "react"
import ChatBubble from "./ChatBubble"
import { useAuthContext } from "../Authentication/hooks/useAuthContext"
import useChat from "./hooks/useChat"
import { useConversationContext } from "../Conversations/hooks/useConversationContext"

function parseMessage(msg:Message):Message {
    console.log(msg)

    return msg
}
type Props = {
    messages:Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export default function ChatMessages(props:Props) {
    const {messages, setMessages} = props
    const {user} = useAuthContext()
    const {currentConversation} = useConversationContext()

    useEffect(()=>{
        setMessages([])
    }, [currentConversation])
    return (
        <div className='w-full h-full border border-black p-4 flex flex-col gap-4'>
            <span className='flex gap-4'>
                <h1>Logged in as: </h1>
                <p>{user && user.username}</p>
                <p>{user && user.email}</p>
                <p>{user && user.userUUID}</p>
            </span>
            <span>Current Room: {currentConversation !== null ? currentConversation.label : ''}</span>
            {
                user &&
                    messages.map((message, index) => {
                        return (
                            <ChatBubble 
                                key={index}
                                content={message.content} 
                                author={message.author} 
                                timestamp={message.timestamp} 
                                status={""} 
                                isSelf={user.userUUID === message.author.userUUID}
                            />
                        )
                    })
            }
        </div>
    )
}
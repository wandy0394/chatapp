import { Message } from "./types"
import { useEffect } from "react"
import ChatBubble from "./ChatBubble"
import { useAuthContext } from "../Authentication/hooks/useAuthContext"

import { useConversationContext } from "../Conversations/hooks/useConversationContext"
import { User } from "../Authentication/AuthContext"

function parseMessage(msg:Message):Message {
    console.log(msg)

    return msg
}
type Props = {
    messages:Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export default function ChatMessages(props:Props) {
    
    const {user} = useAuthContext()
    const {currentConversation, messages, setMessages} = useConversationContext()
    
    

    
    return (
        <div className='w-full h-full flex flex-col'>
            {/* <div className='bg-gray-500 w-full h-16 flex flex-col justify-center px-4'>
                <span><h2 className='text-4xl '>{currentConversation && (filterLabel(currentConversation.label))}</h2></span>
            </div> */}
            <div className='w-full h-full flex flex-col px-4 gap-4 overflow-y-scroll no-scrollbar'>
                {/* <span className='flex gap-4'>
                    <h1>Logged in as: </h1>
                    <p>{user && user.username}</p>
                    <p>{user && user.email}</p>
                    <p>{user && user.userUUID}</p>
                </span>
                <span>Current Room: {currentConversation !== null ? currentConversation.label : ''}</span>
                <span>Current Room UUID: {currentConversation !== null ? currentConversation.uuid : ''}</span> */}
                {
                    user && currentConversation !== null &&
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
        </div>
    )
}
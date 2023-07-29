import ChatBubble from "./ChatBubble"
import { useAuthContext } from "../Authentication/hooks/useAuthContext"
import { useConversationContext } from "../Conversations/hooks/useConversationContext"
import { useEffect, useRef } from "react"




export default function ChatMessages() {
    
    const {user} = useAuthContext()
    const {currentConversation, messages} = useConversationContext()
    const scrollRef = useRef<HTMLDivElement>(null)

    
    useEffect(()=>{
        console.log('scrolling')
        console.log(scrollRef.current)
        if (scrollRef.current) {
            scrollRef.current!.scrollTop = scrollRef.current?.scrollHeight
        }
    }, [messages])


    
    return (
        <div className='w-full h-full flex flex-col'>

            <div ref={scrollRef} className='w-full h-full flex flex-col px-4 gap-4 overflow-y-scroll no-scrollbar'>
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
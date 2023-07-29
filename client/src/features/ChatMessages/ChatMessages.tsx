import ChatBubble from "./ChatBubble"
import { useAuthContext } from "../Authentication/hooks/useAuthContext"
import { useConversationContext } from "../Conversations/hooks/useConversationContext"




export default function ChatMessages() {
    
    const {user} = useAuthContext()
    const {currentConversation, messages} = useConversationContext()
    

    
    return (
        <div className='w-full h-full flex flex-col'>

            <div className='w-full h-full flex flex-col px-4 gap-4 overflow-y-scroll no-scrollbar'>
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
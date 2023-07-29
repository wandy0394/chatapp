import ChatInput from "../features/ChatInput/ChatInput";
import ChatMessages from "../features/ChatMessages/ChatMessages";
import ContactList from "../features/ContactList/ContactList";
import NotificationPane from "../features/Notification/NotificationPane";
import ConversationList from "../features/Conversations/ConversationList";

import { Message } from "../features/ChatMessages/types";
import { useEffect } from "react";
import { useConversationContext } from "../features/Conversations/hooks/useConversationContext";
import { useAuthContext } from "../features/Authentication/hooks/useAuthContext";

export default function Home() {
    const {currentConversation, messages, setMessages} = useConversationContext()
    const {user} = useAuthContext()
    function appendMessage(msg:Message) {
        setMessages(state=>[...state, msg])
    }

    function filterLabel(label:string[]) {
        if (user && label) {
            const labels:string = label.filter(l=>l!==user.username).join(',')
            return labels
        }
        return label
    }

    return (

        <div className='h-full w-full grid md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]'>
            <div className='h-full w-full border border-blue-500 hidden md:grid md:grid-rows-2'>
                <ConversationList/>
                <ContactList/>
            </div>
            <div className='h-[calc(100vh-4rem)] w-full border flex flex-col items-center'>               
                <div className='bg-gray-500 w-full h-16 flex flex-col justify-center px-4'>
                    <span><h2 className='text-4xl '>{currentConversation && (filterLabel(currentConversation.label))}</h2></span>
                </div>
                <div className='h-[calc(100vh-8rem)] min-w-[50vw]'>
                    <div className='w-full h-[80%]'>
                        <ChatMessages messages={messages} setMessages={setMessages}/>
                    </div>
                    <div className='w-full h-[20%]'>
                        <ChatInput appendMessage={appendMessage}/>
                    </div>
                </div>
            </div>
            <div className='h-full w-full border border-green-500 hidden lg:block'>
                <NotificationPane/>
            </div>
        </div>

    )
}
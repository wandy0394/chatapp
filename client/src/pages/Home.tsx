import ChatInput from "../features/ChatInput/ChatInput";
import ChatMessages from "../features/ChatMessages/ChatMessages";
import ContactList from "../features/ContactList/ContactList";
import NotificationPane from "../features/Notification/NotificationPane";
import ConversationList from "../features/Conversations/ConversationList";
import useChat from "../features/ChatMessages/hooks/useChat";
import { Message } from "../features/ChatMessages/types";

export default function Home() {
    const {messages, setMessages} = useChat()

    function appendMessage(msg:Message) {
        setMessages(state=>[...state, msg])
    }
    return (

        <div className='h-full w-full grid md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]'>
            <div className='h-full w-full border border-blue-500 hidden md:grid md:grid-rows-2'>
                <ConversationList/>
                <ContactList/>
            </div>
            <div className='h-full w-full border border-red-500 flex flex-col items-center'>
                <div className='h-full min-w-[50vw] grid grid-rows-[5fr_1fr]'>
                    <ChatMessages messages={messages} setMessages={setMessages}/>
                    <ChatInput appendMessage={appendMessage}/>
                </div>
            </div>
            <div className='h-full w-full border border-green-500 hidden lg:block'>
                    <NotificationPane/>
            </div>
        </div>

    )
}
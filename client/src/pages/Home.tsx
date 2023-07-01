import ChatInput from "../features/ChatInput/ChatInput";
import ChatMessages from "../features/ChatMessages/ChatMessages";
import ContactList from "../features/ContactList/ContactList";
import Conversations from "../features/RecentChats/Conversations";

export default function Home() {
    return (
        <div className='h-full w-full grid md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]'>
            <div className='h-full w-full border border-blue-500 hidden md:grid md:grid-rows-2'>
                <Conversations/>
                <ContactList/>
            </div>
            <div className='h-full w-full border border-red-500 flex flex-col items-center'>
                <div className='h-full min-w-[50vw] grid grid-rows-[5fr_1fr]'>
                    <ChatMessages/>
                    <ChatInput/>
                </div>
            </div>
            <div className='h-full w-full border border-green-500 hidden lg:block'>
                Other
            </div>
      </div>
    )
}
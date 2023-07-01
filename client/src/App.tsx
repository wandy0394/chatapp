import ChatInput from "./features/ChatInput/ChatInput";
import ChatMessages from "./features/ChatMessages/ChatMessages";
import ContactList from "./features/ContactList/ContactList";
import Conversations from "./features/RecentChats/Conversations";

function Header() {
  return (
    <div className='bg-primary h-16 w-full'>

    </div>
  )
}

function Footer() {
  return (
    <div className='bg-base-200 h-16 w-full hidden md:block'>

    </div>
  )
}

export default function App() {
  return (
    <div className='h-screen w-full flex flex-col items-center'>
      <Header/>
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
      <Footer/>
    </div>
  )
}
import ChatInput from "./features/ChatInput/ChatInput";
import ChatMessages from "./features/ChatMessages/ChatMessages";

export default function App() {
  return (
    <div className='h-screen w-full grid grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr_1fr]'>
      <div className='h-full w-full border border-blue-500'>
        List
      </div>
      <div className='h-full w-full border border-red-500 grid grid-rows-[5fr_1fr]'>
        <ChatMessages/>
        <ChatInput/>
      </div>
      <div className='h-full w-full border border-green-500 hidden lg:block'>
        Other
      </div>
    </div>
  )
}
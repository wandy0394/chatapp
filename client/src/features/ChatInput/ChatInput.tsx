import { ChangeEvent, useState } from "react"
import { socket } from "../../services/chat-service"

export default function ChatInput() {
    const [message, setMessage] = useState<string>('')

    function handleSendMessage() {
        if (socket.connected) {
            socket.emit("message", message)
        }
    }

    function handleMessageChange(e:ChangeEvent<HTMLTextAreaElement>) {
        setMessage(e.target.value)
    }
    return (
        <div className='w-full h-full grid grid-cols-[4fr_1fr] gap-4 py-4'>
            <textarea className='textarea textarea-bordered resize-none text-xl' onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>handleMessageChange(e)} value={message}/>
            <div className='btn btn-sm btn-primary h-full' onClick={handleSendMessage}>Send</div>
        </div>
    )
}
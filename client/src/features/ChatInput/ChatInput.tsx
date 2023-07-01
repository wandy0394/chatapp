import { ChangeEvent, useState } from "react"
import { socket } from "../../services/chat-service"
import { useAuthContext } from "../Authentication/useAuthContext"
import { User } from "../Authentication/AuthContext"
import { Message } from "../ChatMessages/types"

export default function ChatInput() {
    const [messageContent, setMessageContent] = useState<string>('')
    const {user} = useAuthContext()

    function handleSendMessage() {
        if (socket.connected && user) {
            let author:User = {
                username:user.username,
                email:user.email,
                userUUID:user.userUUID
            }

            let message:Message = {
                author:author,
                content:messageContent,
                timestamp:(new Date().toJSON())
            }
            socket.emit("message", message)
        }
    }

    function handleMessageChange(e:ChangeEvent<HTMLTextAreaElement>) {
        setMessageContent(e.target.value)
    }
    return (
        <div className='w-full h-full grid grid-cols-[4fr_1fr] gap-4 py-4'>
            <textarea className='textarea textarea-bordered resize-none text-xl' onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>handleMessageChange(e)} value={messageContent}/>
            <div className='btn btn-sm btn-primary h-full' onClick={handleSendMessage}>Send</div>
        </div>
    )
}
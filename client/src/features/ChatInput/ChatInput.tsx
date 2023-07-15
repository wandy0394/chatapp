import { ChangeEvent, useState } from "react"
import { webSocket as socket } from "../../services/util/socket"
import { useAuthContext } from "../Authentication/hooks/useAuthContext"
import { User } from "../Authentication/AuthContext"
import { Message } from "../ChatMessages/types"
import { useConversationContext } from "../Conversations/hooks/useConversationContext"

type Props ={
    appendMessage:(message:Message) => void
}
export default function ChatInput(props:Props) {
    const {appendMessage} = props
    const [messageContent, setMessageContent] = useState<string>('')
    const {user} = useAuthContext()
    const {currentConversation} = useConversationContext()

    function handleSendMessage() {
        if (socket.connected && user && currentConversation) {
            let author:User = {
                username:user.username,
                email:user.email,
                userUUID:user.userUUID
            }

            let message:Message = {
                author:author,
                content:messageContent,
                timestamp:(new Date().toJSON()),
                conversationRoomId:currentConversation?.id
            }
            socket.emit("message", message)
            appendMessage(message)
            setMessageContent('')
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
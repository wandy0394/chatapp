import { ChangeEvent, useState } from "react"
import { webSocket as socket } from "../../services/util/socket"
import { useAuthContext } from "../Authentication/hooks/useAuthContext"
import { User } from "../Authentication/AuthContext"
import { Message } from "../ChatMessages/types"
import { useConversationContext } from "../Conversations/hooks/useConversationContext"
import { ConversationService } from "../../services/conversation-service"
import { Conversation } from "../Conversations/types"
import {IoMdSend} from 'react-icons/io'
type Props ={
    appendMessage:(message:Message) => void
}
export default function ChatInput(props:Props) {
    const {appendMessage} = props
    const [messageContent, setMessageContent] = useState<string>('')
    const {user} = useAuthContext()
    const {currentConversation, setCurrentConversation} = useConversationContext()


    function sendMessage(conversationRoomId:string) {
        if (socket.connected && user && currentConversation && messageContent.trim() !== '') {
            let author:User = {
                username:user.username,
                email:user.email,
                userUUID:user.userUUID
            }

            let message:Message = {
                author:author,
                content:messageContent.trim(),
                timestamp:(new Date().toJSON()),
                conversationRoomId:conversationRoomId
            }
            socket.emit("message", message)
            appendMessage(message)
            setMessageContent('')
        }
    }

    function handleSendMessage() {
        if (socket.connected && user && currentConversation && !currentConversation.isTemporary) {
            sendMessage(currentConversation.uuid)
        }
        else if (user && currentConversation && currentConversation.isTemporary) {
            console.log('Creating new conversation')
            const addresseeEmail = currentConversation.memberEmails.find(u=>u!==user.email)
            if (addresseeEmail) {
                    ConversationService.createConversation(addresseeEmail)
                        .then(response=>{
                            if (response) {
                                const newConversation:Conversation = {...currentConversation, uuid:response}
                                sendMessage(response)
                                setCurrentConversation(newConversation)
                            }
                        })
                        .catch(error=>{
                            console.error(error)
                        })

            }
        }
    }

    function handleMessageChange(e:ChangeEvent<HTMLTextAreaElement>) {
        setMessageContent(e.target.value)
    }
    return (
        <div className='w-full h-full grid grid-cols-[4fr_1fr] gap-4 py-4'>
            <textarea className='textarea textarea-bordered resize-none text-xl' onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>handleMessageChange(e)} value={messageContent}/>
            <div 
                className={`h-full ${(currentConversation === null || messageContent.trim() === '') ? 'bg-gray-400 font-bold text-white rounded flex items-center justify-center cursor-not-allowed' : 'btn btn-sm btn-primary'}`} 
                onClick={handleSendMessage}
            >
                <IoMdSend className='w-1/4 h-1/4'/>
            </div>
        </div>
    )
}
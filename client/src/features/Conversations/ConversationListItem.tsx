import { useAuthContext } from "../Authentication/hooks/useAuthContext"

import { useConversationContext } from "./hooks/useConversationContext"
import { Conversation } from "./types"

type Props = {
    conversation:Conversation
}

export default function ConversationListItem(props:Props) {
    const {conversation} = props
    const {getConversationHistory, setCurrentConversation, currentConversation, conversationList, setConversationList, leaveRoom, joinRoom} = useConversationContext()
    
    const {user} = useAuthContext()
    function handleDeleteClick() {
        console.log('leaving room')
        if (conversation) leaveRoom(conversation)
    }


    function handleClick() {
        if (!conversation.isTemporary) {
            // getConversationHistory(conversation.uuid)
            joinRoom(conversation.uuid)
            console.log(conversationList)
            const newConversationList:Conversation[] = conversationList.map(conv => {
                if (conv.uuid === conversation.uuid) {
                    return {
                        uuid:conv.uuid,
                        label:conv.label,
                        hasUnreadMessages:false,
                        memberUUIDs:conv.memberUUIDs,
                        memberEmails:conv.memberEmails,
                        isTemporary:conv.isTemporary
                    }
                }
                return conv
            })
            setConversationList(newConversationList)
        }
        else {
            setCurrentConversation(conversation)
        }
    }

    function filterLabel(label:string[]) {
        if (user && label) {
            const labels:string = label.filter(l=>l!==user.username).join(',')
            return labels
        }
        return label
    }

    return (
        <div 
            className={`group w-full flex items-center justify-between rounded ${currentConversation?.uuid === conversation.uuid && 'bg-primary-focus'}`}    
        >
           
            <label 
                className="text-xl flex gap-8 items-baseline justify-start p-4 rounded hover:cursor-pointer hover:bg-base-200 h-full w-full"
                onClick={handleClick}
            >
                <label className='hover:cursor-pointer '>{filterLabel(conversation.label)}</label>
                <label className={`text-sm bg-info text-black rounded-full px-2 ${conversation.hasUnreadMessages ? 'block' : 'hidden'}`}>NEW</label>
            </label>
            <label 
                className="text-xl aspect-square h-full w-6 rounded items-center justify-center hidden group-hover:flex group-hover:flex-col hover:bg-error hover:cursor-pointer"
                onClick={()=>handleDeleteClick()}
            >
                X
            </label>
        </div>
    )
}
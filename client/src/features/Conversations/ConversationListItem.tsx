import { useConversationContext } from "./hooks/useConversationContext"
import { Conversation } from "./types"

type Props = {
    conversation:Conversation
    joinRoom:(roomId:string) => void
}

export default function ConversationListItem(props:Props) {
    const {conversation, joinRoom} = props
    const {currentConversation, conversationList, setConversationList} = useConversationContext()

    function handleDeleteClick() {

    }

    function handleClick() {
        joinRoom(conversation.id)
        const newConversationList:Conversation[] = conversationList.map(conv => {
            if (conv.id === conversation.id) {
                return {
                    id:conv.id,
                    label:conv.label,
                    hasUnreadMessages:false
                }
            }
            return conv
        })
        setConversationList(newConversationList)
    }
    return (
        <div 
            className='group w-full flex items-center justify-between gap-4 rounded p-4 hover:cursor-pointer hover:bg-base-200'
            onClick={handleClick}
        >
           
            <label className="text-xl flex gap-8 items-baseline justify-center">
                <label>{conversation.label}</label>
                <label className={`text-sm bg-info text-black rounded-full px-2 ${conversation.hasUnreadMessages ? 'block' : 'hidden'}`}>NEW</label>
            </label>
            <label 
                className="text-xl aspect-square w-6 rounded items-center justify-center hidden group-hover:flex group-hover:flex-col hover:bg-error hover:cursor-pointer"
                onClick={()=>handleDeleteClick()}
            >
                X
            </label>
        </div>
    )
}
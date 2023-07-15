import { Conversation } from "./types"

type Props = {
    conversation:Conversation
    joinRoom:(roomId:string) => void
}

export default function ConversationListItem(props:Props) {
    const {conversation, joinRoom} = props
    function handleDeleteClick() {

    }

    function handleClick() {
        joinRoom(conversation.id)
    }
    return (
        <div 
            className='group w-full flex items-center justify-between gap-4 rounded p-4 hover:cursor-pointer hover:bg-base-200'
            onClick={handleClick}
        >
           
            <label className="text-xl flex flex-col justify-center">{conversation.name}</label>
            <label 
                className="text-xl aspect-square w-6 rounded items-center justify-center hidden group-hover:flex group-hover:flex-col hover:bg-error hover:cursor-pointer"
                onClick={()=>handleDeleteClick()}
            >
                X
            </label>
        </div>
    )
}
import { useState } from "react"
import ConversationListItem from "./ConversationListItem"
import { useConversationContext } from "./hooks/useConversationContext"


export default function ConversationList() {
    const {conversationList, getConversations} = useConversationContext()

    const [collapsed, setCollapsed] = useState<boolean>(false)

    
    return (
        <div className='w-full h-full flex flex-col gap-2 justify-start items-center border border-yellow-400 select-none'>
            <div className="px-4 py-2 w-full flex justify-between items-center gap-4 bg-base-200 hover:bg-base-300" >
                <span 
                    className='text-2xl font-medium w-full h-10 flex flex-col justify-center hover:cursor-pointer' 
                    onClick={()=>setCollapsed((state)=>!state)}
                >
                    Conversations
                </span>
                <div className='btn btn-primary btn-xs h-10 aspect-square'><p>New</p></div>
                <div className='btn btn-secondary btn-xs h-10 aspect-square' onClick={getConversations}><p>Refresh</p></div>
            </div>
            <div className="w-full flex flex-col gap-4 px-4" style={{visibility:collapsed?'hidden':'visible'}}> 
                {
                    conversationList.map((conversation) => {
                        return (
                            <ConversationListItem 
                                key={conversation.uuid} 
                                conversation={conversation}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
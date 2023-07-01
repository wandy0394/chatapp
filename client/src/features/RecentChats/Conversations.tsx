import { useState } from "react"
import { Contact } from "../ContactList/ContactList"
import ChatEntry from "./ChatEntry"

type Chat = {
    uuid:string,
    name:string,
    members:Contact[]
}

const DUMMY_CHATS = [
    {uuid:'1', name:'Food', members:[]},
    {uuid:'2', name:'Movies', members:[]},
    {uuid:'3', name:'Musicals', members:[]},
]

export default function Conversations() {
    const [chats, setChats] = useState<Chat[]>(DUMMY_CHATS)
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
            </div>
            <div className="w-full flex flex-col gap-4 px-4" style={{visibility:collapsed?'hidden':'visible'}}> 
                {
                    chats.map((contact) => {
                        return (
                            <ChatEntry key={contact.uuid} name={contact.name}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
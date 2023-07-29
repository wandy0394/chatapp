import ContactEntryMenu from "./ContactEntryMenu"
import ContactAgent from "../../services/contact-service"
import { useContactListContext } from "./hooks/useContactListContext"
import { useConversationContext } from "../Conversations/hooks/useConversationContext"
import { Conversation } from "../Conversations/types"
import { useAuthContext } from "../Authentication/hooks/useAuthContext"
import { createTemporaryUUID } from "../Conversations/util"

type Props = {
    avatar?:string
    name:string
    status:string
    email:string,
    userUUID:string
}



export default function ContactEntry(props:Props) {
    const {avatar, name, status, email, userUUID} = props
    const {setLoading} = useContactListContext()
    const {conversationList, setConversationList, setCurrentConversation} = useConversationContext()
    const {user} = useAuthContext()


    function handleChat() {
        for (let i = 0; i < conversationList.length; i++) {
            //only check cases where conversation only has 2 participants. This excludes group chats
            console.log(conversationList[i].memberUUIDs)
            if (conversationList[i].memberUUIDs.length === 2) {
                if (conversationList[i].memberUUIDs.includes(userUUID)) {
                    console.log('Duplicate')
                    setCurrentConversation(conversationList[i])
                    return
                }
            }
        }
        console.log('creating')
        initializeConversation(email, name, userUUID)
        // createPublicConversation(name, email)
    }

    function initializeConversation(addresseeEmail:string, addresseeUsername:string, addresseeUUID:string) {
        if (user === null || user === undefined) return
        const conversation:Conversation = {
            uuid:createTemporaryUUID(),
            label:[addresseeUsername],
            hasUnreadMessages:false,
            memberUUIDs:[addresseeUUID, user?.userUUID],
            memberEmails:[addresseeEmail, user?.email],
            isTemporary:true
        }
        setConversationList(p=>[...p, conversation])
        setCurrentConversation(conversation)

    }
    function handleRemove() {
        ContactAgent.removeContact(email)
            .then(response=>{
                console.log(response)
                setLoading(true)
            })
            .catch(response=>{
                console.error(response.error)
            })
    }
    return (
        <div className='w-full flex items-center gap-4 rounded-full py-2 px-4 hover:cursor-pointer hover:bg-base-200'>
            {
                avatar 
                   ? <img className='avatar aspect-square w-10' src={avatar || ''} />
                   : <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span className="text-3xl">{name.slice(0, 1).toUpperCase()}</span>
                        </div>
                    </div> 
            }
            <div className='w-full flex items-center justify-between'>
                <label className="text-xl">{name}</label>
                <div className='flex items-center gap-4'>
                    <div className={`text-sm ${status === 'PENDING' ? 'block text-yellow-500' :'hidden'}`}>{status}</div>
                    <div className='dropdown dropdown-right'>
                        <label tabIndex={0} className="rounded-full aspect-square hover:bg-base-100 w-10 flex items-center justify-center">&#8942;</label>
                        <ul tabIndex={0} className="dropdown-content z-[1] shadow bg-base-100 rounded border border-solid border-gray-500 ">
                            <ContactEntryMenu canChat={status==='PENDING'?false:true} handleChat={handleChat} handleRemove={handleRemove}/>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
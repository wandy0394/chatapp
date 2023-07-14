import ContactEntryMenu from "./ContactEntryMenu"
import ContactAgent from "../../services/contact-service"
import { useContactListContext } from "./hooks/useContactListContext"

type Props = {
    avatar?:string
    name:string
    status:string
    email:string
}



export default function ContactEntry(props:Props) {
    const {avatar, name, status, email} = props
    const {setLoading} = useContactListContext()
    function handleChat() {

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
                        {/* <div className='rounded-full aspect-square hover:bg-base-100 w-10 flex items-center justify-center' onClick={handleMenuClick}>&#8942;</div> */}
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
import { useState } from "react"
import ContactAgent from "../../services/contact-service"
import { useContactListContext } from "./hooks/useContactListContext"

type Props = {

}

type Message = {
    type:'error' | 'success' | 'info'
    message:string
}
export default function AddContactForm(props:Props) {
    const [email, setEmail] = useState<string>('')
    const [message, setMessage] = useState<Message>({type:'info', message:''})
    const {setLoading} = useContactListContext()
    
    
    function handleAddContact(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(email)
        ContactAgent.addContact(email)
            .then((response) => {
                console.log(response)
                setMessage({type:'success', message:'Request sent.'})
                setLoading(true)
            })
            .catch((response) => {
                setMessage({type:'error', message:response.message})
            })
    }

    return (
        <form className='rounded bg-base-200 flex flex-col w-full gap-4 p-4' onSubmit={(e)=>handleAddContact(e)}>
            <input className="input" type='email' placeholder="Enter email..." value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <span className={`px-4 ${message.type==='error' && 'text-red-500'} ${message.type==='success' && 'text-green-500'} align-middle`}>{message.message}</span>
            <button type='submit' className='btn btn-primary' >Add Contact</button>
        </form>
    )
}
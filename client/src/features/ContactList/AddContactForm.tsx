import { useState } from "react"

type Props = {

}
export default function AddContactForm(props:Props) {
    const [email, setEmail] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('')
    function handleAddContact(e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(email)
    }

    return (
        <form className='rounded bg-base-200 flex flex-col w-full gap-4 p-4' onSubmit={(e)=>handleAddContact(e)}>
            <input className="input" type='email' placeholder="Enter email..." value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <span className='px-4 text-red-500 align-middle'>{errorMessage}</span>
            <button type='submit' className='btn btn-primary' >Add Contact</button>
        </form>
    )
}
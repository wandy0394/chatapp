import { useState } from "react"
import ContactEntry from "./ContactEntry"
import AddContactForm from "./AddContactForm"
import useGetContacts from "./hooks/useGetContacts"
import { useContactListContext } from "./hooks/useContactListContext"


export default function ContactList() {
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const [addContactVisible, setAddContactVisible] = useState<boolean>(false)
    const {contacts, message, loading, setLoading} = useContactListContext()
    function handleClick() {
        setAddContactVisible(state=>!state)
    }
    return (
        <div className='w-full h-full flex flex-col justify-start items-center border border-yellow-400 select-none'>
            <div className="px-4 py-2 w-full flex justify-between items-center gap-4 bg-base-200 hover:bg-base-300" >
                <span 
                    className='text-2xl font-medium w-full h-full flex flex-col justify-center hover:cursor-pointer' 
                    onClick={()=>setCollapsed((state)=>!state)}
                >
                    Contacts
                </span>
                <div className={`btn ${addContactVisible ? 'btn-secondary' : 'btn-primary'} rounded aspect-square`} onClick={handleClick}>
                    {
                        addContactVisible ? '-' : '+'
                    }
                </div>
            </div>
            <div className={`w-full ${addContactVisible ? 'block' : 'hidden'}` }>
                <AddContactForm/>
            </div>
            <div className="w-full flex flex-col gap-4 px-4 py-4" style={{visibility:collapsed?'hidden':'visible'}}> 
                {
                    contacts.map((contact) => {
                        return (
                            <ContactEntry key={contact.uuid} name={contact.username} avatar={contact.avatar} status={contact.status} email={contact.email}/>
                        )
                    })
                }
                {
                    message 
                }
            </div>
        </div>
    )
}
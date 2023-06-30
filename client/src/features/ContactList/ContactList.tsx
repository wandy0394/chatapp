import { useState } from "react"
import ContactEntry from "./ContactEntry"

export type Contact = {
    name:string,
    avatar?:string,
    uuid:string
}

const DUMMY_CONTACTS:Contact[] = [
    {name:'steve', uuid:'1'},
    {name:'adam', uuid:'2'},
    {name:'tarja', uuid:'3'},
    {name:'nikita', uuid:'4'},
]

export default function ContactList() {
    const [contacts, setContacts] = useState<Contact[]>(DUMMY_CONTACTS)
    const [collapsed, setCollapsed] = useState<boolean>(false)
    return (
        <div className='w-full h-full flex flex-col gap-2 justify-start items-center border border-yellow-400 select-none'>
            <div className="px-4 py-2 w-full flex justify-between items-center gap-4 bg-base-200 hover:bg-base-300" >
                <span 
                    className='text-2xl font-medium w-full h-full flex flex-col justify-center hover:cursor-pointer' 
                    onClick={()=>setCollapsed((state)=>!state)}
                >
                    Contacts
                </span>
                <div className='btn btn-primary rounded' onClick={()=>alert('hello')}>+</div>
            </div>
            <div className="w-full flex flex-col gap-4 px-4" style={{visibility:collapsed?'hidden':'visible'}}> 
                {
                    contacts.map((contact) => {
                        return (
                            <ContactEntry key={contact.uuid} name={contact.name} avatar={contact.avatar}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
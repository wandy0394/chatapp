import { createContext, useEffect, useState } from "react"
import { Contact } from "../types/types"
import ContactAgent from "../../../services/contact-service"

type ContextType = {
    contacts:Contact[]
    message:string
    loading:boolean
    setLoading:React.Dispatch<React.SetStateAction<boolean>> 
}


export const ContactListContext = createContext<ContextType>({
    contacts:[],
    message:'',
    loading:true,
    setLoading:Function.prototype()
})

export const ContactListContextProvider = ({children}:any) => {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(()=>{
        async function getContactList() {
            try {
                const list = await ContactAgent.getContactList()
                setContacts(list || [])
                if (list?.length === 0) {
                    setMessage('You have no contacts.')
                }
                else {
                    setMessage('')
                }
                setLoading(false)
            }
            catch (e) {
                //TODO
                setMessage('Could not fetch contact list.')
                setLoading(false)
                console.error(e)
            }
        }
        if (loading) {
            console.log('Getting contact list')
            getContactList()
        }
    }, [loading])

    return (
        <ContactListContext.Provider value ={{contacts, message, loading, setLoading}}>
            {children}
        </ContactListContext.Provider>
    )
}
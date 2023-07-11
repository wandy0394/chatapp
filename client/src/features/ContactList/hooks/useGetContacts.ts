import { useEffect, useState } from "react"
import { Contact } from "../types/types"
import ContactAgent from "../../../services/contact-service"

export default function useGetContacts() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [message, setMessage] = useState<string>('')
    useEffect(()=>{
        async function getContactList() {
            try {
                const list = await ContactAgent.getContactList()
                setContacts(list || [])
                if (list?.length === 0) setMessage('You have no contacts.')
            }
            catch (e) {
                //TODO
                setMessage('Could not fetch contact list.')
                console.error(e)
            }
        }
        getContactList()
    }, [])

    return {contacts, message}
}
import { useEffect, useState } from "react"
import { Contact } from "../types/types"
import ContactAgent from "../../../services/contact-service"

export default function useGetContacts() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [message, setMessage] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(()=>{
        async function getContactList() {
            try {
                const list = await ContactAgent.getContactList()
                setContacts(list || [])
                if (list?.length === 0) setMessage('You have no contacts.')
                setLoading(false)
            }
            catch (e) {
                //TODO
                setMessage('Could not fetch contact list.')
                console.error(e)
                setLoading(false)
            }
        }
        getContactList()
    }, [loading])

    return {contacts, message, loading, setLoading}
}
import { useEffect, useState } from "react"
import { ContactRequestNotification, MessageNotification, Notification } from "../models/Notification"


type Props = {
    setLoading:React.Dispatch<React.SetStateAction<boolean>>
}

const URL = 'http://192.168.0.128:4040/notifications'

export default function useNotifications(props:Props) {
    const {setLoading} = props
    const [notifications, setNotifications] = useState<Notification[]>([])

    const handleContactRequest = (msg:MessageEvent) => {
        let notif = new ContactRequestNotification(msg)
        setNotifications(prev => [...prev, notif])
    }

    const handleContactRequestResolved = (msg:MessageEvent) => {
        let notif:MessageNotification = new MessageNotification(msg)
        setNotifications(prev => [...prev, notif])
        setLoading(true)
    }
    useEffect(()=>{
        const source = new EventSource(URL, {
            withCredentials:true
        })
        source.addEventListener('contact-request', handleContactRequest)
        source.addEventListener('contact-request-resolved', handleContactRequestResolved)
        return ()=>{
            source.removeEventListener('contact-request', handleContactRequest)
            source.removeEventListener('contact-request-resolved', handleContactRequestResolved)
        }

    }, [])

    return {notifications, setNotifications}
}
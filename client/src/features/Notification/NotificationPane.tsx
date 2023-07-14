import { useEffect, useState } from "react"
import NotificationCard from "./NotificationCard"
import { ContactRequestNotification, MessageNotification, Notification } from "./models/Notification"

const URL = 'http://192.168.0.128:4040/notifications'
export default function NotificationPane() {

    const [notifications, setNotifications] = useState<Notification[]>([])

    function removeNotification(notificationId:string) {
        const newNotifications = notifications.filter(n=>n.getMessageData().id !== notificationId)
        setNotifications(newNotifications)
    }

    useEffect(()=>{
        const source = new EventSource(URL, {
            withCredentials:true
        })

        const handleContactRequest = (msg:MessageEvent) => {
            let notif = new ContactRequestNotification(msg, removeNotification)
            setNotifications([...notifications, notif])
        }

        const handleContactRequestAccepted = (msg:MessageEvent) => {
            let notif:MessageNotification = new MessageNotification(msg, removeNotification)
            setNotifications([...notifications, notif])
        }

        source.addEventListener('contact-request', handleContactRequest)
        source.addEventListener('contact-request-resolved', handleContactRequestAccepted)
        return ()=>{
            source.removeEventListener('contact-request', handleContactRequest)
            source.removeEventListener('contact-request-resolved', handleContactRequestAccepted)
        }

    }, [])

    return (
        <div className='w-full flex flex-col items-center justify-start'>
            <div className="px-4 py-2 w-full flex justify-between items-center gap-4 bg-base-300" >
                <span 
                    className='text-2xl font-medium w-full h-full flex flex-col justify-center' 
                >
                    Notifications
                </span>
            </div>
            <div className='w-full flex flex-col items-center justify-center gap-4 p-4'>
                {
                    notifications.map(notification=>{
                        return (
                            <NotificationCard notification={notification}/>
                        )
                    })
                }
            </div>
        </div>
    )
}
import { useEffect, useState } from "react"
import NotificationCard from "./NotificationCard"

export type Notification = {
    message:string,
    cancellable:boolean,
    rejectable:boolean
    acceptable:boolean,
}

export default function NotificationPane() {

    const [notifications, setNotifications] = useState<Notification[]>([])
    useEffect(()=>{
        const source = new EventSource('http://192.168.0.128:4040/notifications', {
            withCredentials:true
        })

        const handleContactRequest = (msg:MessageEvent) => {
            console.log(msg.data)
            let notif:Notification = {
                message:msg.data,
                cancellable:false,
                rejectable:true,
                acceptable:true
            }
            setNotifications([...notifications, notif])
        }

        source.addEventListener('registration', (msg)=>console.log(msg.data))
        source.addEventListener('contact-request', handleContactRequest)
        return ()=>{
            source.removeEventListener('contact-request', handleContactRequest)
        }

    }, [])
    return (
        <div className='w-full flex flex-col items-center justify-start'>
            <span 
                className='text-2xl font-medium w-full h-full flex flex-col justify-center hover:cursor-pointer' 
            >
                Notifications
            </span>
            <div className='w-full flex flex-col items-center justify-center gap-4'>
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
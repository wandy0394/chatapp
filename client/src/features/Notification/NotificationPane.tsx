import NotificationCard from "./NotificationCard"
import useNotifications from "./hooks/useNotifications"
import { useContactListContext } from "../ContactList/hooks/useContactListContext"

export default function NotificationPane() {

    const {setLoading} = useContactListContext()
    const {notifications, setNotifications} = useNotifications({setLoading})

    return (
        <div className='w-full flex flex-col items-center justify-start'>
            <div className="px-4 w-full flex justify-between items-center gap-4 bg-base-300" >
                <span 
                    className='text-2xl font-medium w-full h-16 flex flex-col justify-center' 
                >
                    Notifications
                </span>
            </div>
            <div className='w-full flex flex-col items-center justify-center gap-4 p-4'>
                {
                    notifications.map(notification=>{
                        return (
                            <NotificationCard 
                                key={notification.getMessageData().id} 
                                notification={notification} 
                                notifications={notifications} 
                                setNotifications={setNotifications}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}
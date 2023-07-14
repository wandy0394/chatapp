import { Notification } from "./models/Notification"
type Props = {
    notification:Notification
    notifications:Notification[]
    setNotifications:React.Dispatch<React.SetStateAction<Notification[]>>
}

export default function NotificationCard(props:Props) {
    const {notification, setNotifications, notifications} = props


    function removeNotification() {
        const newNotifications = [...notifications].filter(n=>n.getMessageData().id !== notification.getMessageData().id)
        setNotifications(newNotifications)
    }

    function handleAccept() {
        notification.accept()
        removeNotification()
    }

    function handleReject() {
        notification.reject()
        removeNotification()
    }

    function handleAcknowledge() {
        notification.acknowledge()
        removeNotification()
    }

    return (
        <div className='w-full bg-base-200 rounded border border-solid flex flex-col gap-2 p-4'>
            <span className='text-sm rounded'>{notification.getType()}</span>
            <span className='text-xl'>{notification.getMessage()}</span>
            <span className='w-full flex items-center justify-between pt-2'>
                {
                    notification.isAccpetable() && 
                        <div className='btn btn-primary btn-xs rounded' onClick={()=>handleAccept()}>ACCEPT</div>
                }
                {
                    notification.isRejectable() && 
                        <div className='btn btn-secondary btn-xs rounded' onClick={()=>handleReject()}>REJECT</div>
                }
                {   
                    notification.isAcknowledegable() &&
                        <div className='btn btn-xs rounded' onClick={()=>handleAcknowledge()}>OK</div>
                }               
            </span>
        </div>
    )
}
import { Notification } from "./models/Notification"
type Props = {
    notification:Notification

}

export default function NotificationCard(props:Props) {
    const {notification} = props
    return (
        <div className='w-full bg-base-200 rounded border border-solid flex flex-col gap-2 p-4'>
            <span className='text-sm rounded'>{notification.getType()}</span>
            <span className='text-xl'>{notification.getMessage()}</span>
            <span className='w-full flex items-center justify-between pt-2'>
                {
                    notification.isAccpetable() && 
                        <div className='btn btn-primary btn-xs rounded' onClick={()=>notification.accept()}>ACCEPT</div>
                }
                {
                    notification.isRejectable() && 
                        <div className='btn btn-secondary btn-xs rounded' onClick={()=>notification.reject()}>REJECT</div>
                }
                {   
                    notification.isAcknowledegable() &&
                        <div className='btn btn-xs rounded' onClick={()=>notification.acknowledge()}>OK</div>
                }               
            </span>
        </div>
    )
}
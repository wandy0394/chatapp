import { Notification } from "./NotificationPane"
type Props = {
    notification:Notification
}

export default function NotificationCard(props:Props) {
    const {notification} = props
    return (
        <div className='w-full bg-base-200 rounded border border-solid'>
            {notification.message}
        </div>
    )
}
import { User } from "../Authentication/AuthContext"

type Props = {
    img?:string
    author:User
    timestamp:string
    status:string
    content:string
    isSelf:boolean
}

export default function ChatBubble(props:Props) {
    const {img, author, timestamp, content, status, isSelf} = props
    return (
        <div className={`chat ${isSelf?'chat-end':'chat-start'}`}>
            <div className="chat-image">
                <div className="w-10 rounded-full">
                    {
                        img 
                           ? <img className='avatar' src={img} />
                           : <div className="avatar placeholder">
                                <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                                    <span className="text-3xl">{author.username.slice(0, 1).toUpperCase()}</span>
                                </div>
                            </div> 
                    }
                </div>
            </div>
            <div className={`chat-header flex items-center gap-2`}>
                {author.username}
                <time className="text-xs opacity-50">{timestamp}</time>
            </div>
            <div className={`chat-bubble ${isSelf?'bg-primary':'bg-secondary'}`}>{content}</div>
            <div className="chat-footer opacity-50">
                {status}
            </div>
        </div>
    )
}
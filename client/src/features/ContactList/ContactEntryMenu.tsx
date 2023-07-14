type Props = {
    canChat:boolean
    handleChat:()=>void
    handleRemove:()=>void
}

export default function ContactEntryMenu(props:Props) {
    const{canChat, handleChat, handleRemove} = props
    return (
        <ul className={`menu w-32 flex flex-col gap-y-2`}>
            <li className={`${canChat ? 'hover:bg-gray-700' :''} rounded p-2`} onClick={handleChat}>Chat</li>
            <li className='text-red-500 hover:bg-gray-700 rounded p-2' onClick={handleRemove}>Remove</li>
        </ul>
    )
}
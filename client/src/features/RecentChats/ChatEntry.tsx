import { Contact } from "../ContactList/ContactList"

type Props = {
    key?:any
    name:string
    members?:Contact[]
}

export default function ChatEntry(props:Props) {
    const {key, name} = props
    return (
        <div key={key} className='w-full flex items-center justify-between gap-4 rounded p-4 hover:cursor-pointer hover:bg-base-200'>
           
            <label className="text-xl flex flex-col justify-center">{name}</label>
            <label className="text-xl rounded justify-center hidden hover:flex hover:flex-col">X</label>
        </div>
    )
}
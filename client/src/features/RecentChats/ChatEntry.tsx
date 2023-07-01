import { Contact } from "../ContactList/ContactList"

type Props = {
    key?:any
    name:string
    members?:Contact[]
}

export default function ChatEntry(props:Props) {
    const {key, name} = props
    function handleDeleteClick() {

    }
    return (
        <div key={key} className='group w-full flex items-center justify-between gap-4 rounded p-4 hover:cursor-pointer hover:bg-base-200'>
           
            <label className="text-xl flex flex-col justify-center">{name}</label>
            <label 
                className="text-xl aspect-square w-6 rounded items-center justify-center hidden group-hover:flex group-hover:flex-col hover:bg-error hover:cursor-pointer"
                onClick={()=>handleDeleteClick()}
            >
                X
            </label>
        </div>
    )
}
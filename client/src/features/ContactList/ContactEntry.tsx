type Props = {
    avatar?:string
    name:string
}

export default function ContactEntry(props:Props) {
    const {avatar, name} = props
    return (
        <div className='w-full flex items-center gap-4 rounded-full p-2 hover:cursor-pointer hover:bg-base-200'>
            {
                avatar 
                   ? <img className='avatar aspect-square w-10' src={avatar || ''} />
                   : <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span className="text-3xl">{name.slice(0, 1).toUpperCase()}</span>
                        </div>
                    </div> 
            }
            <label className="text-xl">{name}</label>
        </div>
    )
}
type Props = {
    avatar?:string
    name:string
    status:string
}

export default function ContactEntry(props:Props) {
    const {avatar, name, status} = props
    return (
        <div className='w-full flex items-center gap-4 rounded-full py-2 px-4 hover:cursor-pointer hover:bg-base-200'>
            {
                avatar 
                   ? <img className='avatar aspect-square w-10' src={avatar || ''} />
                   : <div className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                            <span className="text-3xl">{name.slice(0, 1).toUpperCase()}</span>
                        </div>
                    </div> 
            }
            <div className='w-full flex items-center justify-between'>
                <label className="text-xl">{name}</label>
                <label className={`text-xl ${status === 'PENDING' ? 'visible text-yellow-500' :'hidden'}`}>{status}</label>
            </div>
        </div>
    )
}
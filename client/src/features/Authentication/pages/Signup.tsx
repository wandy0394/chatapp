import {useState, FormEvent} from 'react'
import {Link} from 'react-router-dom'
import { useSignup } from '../hooks/useSignup'
import {useNavigate} from 'react-router-dom'


export default function Signup() {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {register, error, isLoading} = useSignup()
    const navigate = useNavigate()

    async function handleSubmit(e:FormEvent) {
        e.preventDefault()
        register(email, password, name)
            .then(()=>{
                navigate('/')
            })
            .catch((error)=>{
                console.error(error)
            })
    }

    return (
        <div className='m-auto py-24 w-full h-screen'>

            <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 items-center justify-center w-full lg:w-2/3 mx-auto'>
                <h3 className='text-4xl font-bold'>Sign Up</h3>
                <div className='flex flex-col gap-y-2 w-full lg:w-1/2 xl:w-1/3'>
                    <label className='text-xl'>Name:</label>
                    <input
                        className='w-full'
                        type='text'
                        onChange = {(e)=>setName(e.target.value)}
                        value={name}
                    />
                </div>
                <div className='flex flex-col gap-y-2 w-full lg:w-1/2 xl:w-1/3'>
                    <label className='text-xl'>Email:</label>
                    <input
                        className='w-full'
                        type='email'
                        onChange = {(e)=>setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className='flex flex-col gap-y-2 lg:w-1/2 xl:w-1/3'>
                    <label className='text-xl'>Password:</label>
                    <input
                        className='w-full'
                        type='password'
                        onChange = {(e)=>setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <div className='flex gap-x-8 items-center justify-center'>
                    <button 
                        disabled={isLoading as boolean} 
                        // disabled
                        type='submit'
                        // className='rounded border-1 bg-blue-700 text-white px-2 py-1 align-middle hover:bg-blue-400'
                        className='btn btn-primary px-2 py-1 align-middle'
                    >
                        Register
                    </button>
                    <Link to='..' >Go Back</Link>
                </div>
                <div className='text-red-700'>
                    {error}
                </div>
            </form>
        </div>
    )
}
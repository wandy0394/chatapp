import {useState, FormEvent} from 'react'
import {Link} from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import {useNavigate} from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {login, isLoading, error} = useLogin()
    const navigate = useNavigate()

    async function handleSubmit(e:FormEvent) {
        e.preventDefault()
        login(email, password)
            .then(()=>{
                navigate('/')
                // console.log('success')
            })
            .catch((error)=>{
                console.error(error)
            })
    }

    return (
        <div className='m-auto py-24 w-full h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-y-4 items-center justify-center w-full lg:w-2/3 mx-auto'>
                <h3 className='text-4xl font-bold'>Log in</h3>
                <div className='flex flex-col gap-y-2 w-full lg:w-1/2 xl:w-1/3'>
                    <label className='text-xl'>Email:</label>
                    <input
                        className='w-full'
                        type='email'
                        onChange = {(e)=>setEmail(e.target.value)}
                        value={email}
                        />
                </div>
                <div className='flex flex-col gap-y-2 w-full lg:w-1/2 xl:w-1/3'>
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
                        type='submit' 
                        className='btn btn-primary px-2 py-1 align-middle'

                    >
                        Login
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
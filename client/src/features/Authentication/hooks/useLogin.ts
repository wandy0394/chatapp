import { ACTION_TYPES } from "../AuthContext"
import {useState} from 'react'
import Authenticator from "../../../services/authentication-service"
import { useAuthContext } from "./useAuthContext"

export function useLogin() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | null>(null)
    const {dispatch} = useAuthContext()
    
    async function login (email:string, password:string) {
        setIsLoading(true)
        setError(null)
        
        try {
            const response = await Authenticator.login(email, password)
            if (dispatch) dispatch({type:ACTION_TYPES.LOGIN, payload:{...response}})
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            if (error instanceof Error) {
                setError(error.message)
                throw error
            }
            console.error(error)
            setError('Unknown Error')
            throw new Error('Unknown Error')
        }
    }
    return {login, error, isLoading}
}
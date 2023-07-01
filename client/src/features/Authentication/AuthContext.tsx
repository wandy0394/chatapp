import {createContext, useReducer, useEffect} from 'react'

export const ACTION_TYPES = {
    LOGIN:'LOGIN',
    LOGOUT:'LOGOUT',
    FINISHED_LOADING:'FINISHED_LOADING'
}

export type User = {
    username:string,
    email:string,
    userUUID:string
}

type AuthState = {
    user: User
    finishedLoading:boolean
}

type Action = {
    type: string,
    payload:any
}

type ContextType = {
    dispatch: React.Dispatch<Action> | null,
    user:any
    finishedLoading:boolean
}

export const AuthContext = createContext<ContextType>({dispatch:null, user:null, finishedLoading:false})
export const authReducer = (state:AuthState, action:Action) => {
    switch (action.type) {
        case ACTION_TYPES.LOGIN:
            return {user:action.payload.user, finishedLoading:true}
        case ACTION_TYPES.LOGOUT:
            return {...state, user:null}
        case ACTION_TYPES.FINISHED_LOADING:
            return {...state, finishedLoading:true}
        default:
            return state
    }
}
export const AuthContextProvider  = ({children}:any) => {
    const [state, dispatch] = useReducer(authReducer, {
        user:null,
        finishedLoading:false
    })
    
    console.log('AuthContext state: ', state)

    async function getSession() {
        try {
            // const result = await Authenticator.getSession() //TODO
            const result = {
                username:'Dev',
                email:'dev@dev.com',
                userUUID:'12346'
            }
            dispatch({type:ACTION_TYPES.LOGIN, payload:{user:result}})
        }
        catch (error) {
            dispatch({type:ACTION_TYPES.FINISHED_LOADING, payload:null})
        }
    }

    let called = false
    useEffect(()=>{
        if (!called) {
            getSession()
        }
        return ()=>{
            called = true
        }
    }, [])
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}
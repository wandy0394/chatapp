import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect } from "react";



export default function RequireAuth() {
    const {user, finishedLoading} = useAuthContext();
    const navigate = useNavigate()

    useEffect(()=>{
        if (!user && finishedLoading) {
            navigate('/login')
        }
    }, [user, finishedLoading])
    return <Outlet/>
}
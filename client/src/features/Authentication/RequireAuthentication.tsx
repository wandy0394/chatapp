import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";



export default function RequireAuth() {
    const {user, finishedLoading} = useAuthContext();
    const location = useLocation();

    if (!user) {
        return <Navigate to ='/login' state={{from:location}}/>
    }

    return <Outlet/>
}
import { Routes, Route } from "react-router-dom";
import RequireAuth from "../features/Authentication/RequireAuthentication";
import Login from "../features/Authentication/pages/Login";
import Signup from "../features/Authentication/pages/Signup";
import Home from "../pages/Home";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route element={<RequireAuth/>}>
                <Route path='/' element={<Home/>}/>
            </Route>
            <Route path='*' element={<h1>Error 404</h1>}/>
        </Routes>
    )
}
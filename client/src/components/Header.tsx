import { Link } from "react-router-dom";
import { useAuthContext } from "../features/Authentication/hooks/useAuthContext";
import { useLogout } from "../features/Authentication/hooks/useLogout";

export default function Header() {
  const {user} = useAuthContext()  
  const {logout} = useLogout()
  function handleLogout() {
    logout()
  }
  return (
      <div className='bg-primary h-16 w-full flex items-center justify-between px-4'>
        <div>
            <Link className='text-3xl' to="/">
                CHAT
            </Link>
        </div>
        <div>
          {
            user &&
              <span className='text-xl'>Hello <span className="text-3xl font-bold">{user.username}</span></span>
          }
        </div>
        <div className='flex items-center justify-between gap-4'>
          
          {
            (user === undefined || user === null)
              ? <>
                <Link className="btn btn-primary" to='/login'>
                  Login
                </Link>
                <Link className="btn btn-secondary" to='/signup'>
                  Signup
                </Link>
              </>
              : <Link className='btn btn-primary' to='/' onClick={handleLogout}>
                  Logout
                </Link>
          }
        </div>
      </div>
    )
  }
  
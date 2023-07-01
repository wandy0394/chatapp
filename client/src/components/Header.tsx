import { Link } from "react-router-dom";

export default function Header() {
    return (
      <div className='bg-primary h-16 w-full flex items-center justify-between px-4'>
        <div>
            <Link className='text-3xl' to="/">
                CHAT
            </Link>

        </div>
        <div className='flex items-center justify-between gap-4'>
            <Link className="btn btn-primary" to='/login'>
              Login
            </Link>
            <Link className="btn btn-secondary" to='/signup'>
              Signup
            </Link>
        </div>
      </div>
    )
  }
  
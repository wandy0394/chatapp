import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";


function Footer() {
  return (
    <div className='bg-base-200 h-16 w-full hidden md:block'>

    </div>
  )
}

export default function App() {
  return (
    <div className='h-screen w-full flex flex-col items-center'>
      <Header/>
      <AppRoutes/>     
      <Footer/>
    </div>
  )
}
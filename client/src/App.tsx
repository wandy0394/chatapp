export default function App() {
  return (
    <div className='h-screen w-full grid grid-cols-[1fr_4fr_1fr]'>
      <div className='h-full w-full border border-blue-500'>List</div>
      <div className='h-full w-full border border-red-500'>Chat</div>
      <div className='h-full w-full border border-green-500'>Other</div>
    </div>
  )
}
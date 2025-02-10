//
import { CurrentProfile } from '@/hooks/own-current-user'
// 
const Admin = async () => {
  //
  const connected = CurrentProfile()
  //
  return (
    <div className='flex w-full h-full flex-col'>
      <div className='flex items-center justify-center py-4 border-2 border-blue-500'>
        <div>search</div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-3 m-4'>
        <p>page admin</p>
      </div>
    </div>
  )
}
//
export default Admin

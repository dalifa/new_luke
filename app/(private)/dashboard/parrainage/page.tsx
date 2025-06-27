
import ParrainageForm from '@/components/dashboard/parrainageForm';
import { CurrentProfile } from '@/hooks/own-current-user';
//

const Parrainage = async () => {
  const connected = await CurrentProfile()
  //  
  return (
    <div className='h-screen flex items-center justify-center flex-col lg:px-4 bg-indigo-600'>
      <div className='flex flex-col items-center justify-center px-4 lg:px-10 text-lg lg:text-2xl h-4/5 lg:h-3/5 w-4/5 lg:w-2/5 rounded text-center bg-white shadow-xl'>
        <p className='text-indigo-600 text-center text-xl mb-10'>
          Parrainer un frère, une soeur pour le Beta Test
        </p>
        <ParrainageForm/>
      </div>
    </div>
  )
}
//
export default Parrainage

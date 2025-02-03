//
import { Counters } from '@/components/dashboard/counters';
import { Card } from '@/components/ui/card';
import { CurrentProfile } from '@/hooks/own-current-user';
//
const Transfer = async () => {
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const connectedUser = await CurrentProfile()
  // s'il a déjà 2 demande de transfert en court
  return ( 
    <div className='h-ull flex items-center flex-col'>
      <div className='w-full md:w-4/5 lg:w-3/5 flex flex-col items-center gap-y-4 mx-4 lg:my-10 p-5'>
        <div className='w-full grid grid-cols-1 gap-4 md:gap-4'>
          <div>
            <Counters/> 
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
            <Card className='bg-white p-4 shadow-lg shadow-blue-200'>
              <div className='mb-10'>
                <p className='text-center text-slate-500 text-md md:text-lg font-semibold'>
                  Transférer votre cagnotte vers votre crédit
                </p>
              </div>
            </Card>
            <Card className='bg-white p-4 shadow-lg shadow-blue-200'>
              <div className='mb-10'>
                <p className='text-center text-slate-500 text-md md:text-lg font-semibold'>
                  Obtenir un code de retrait de cagnotte
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
//
export default Transfer

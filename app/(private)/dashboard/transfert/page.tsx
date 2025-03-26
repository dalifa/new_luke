//
import { Counters } from '@/components/dashboard/counters';
import { JackpotToCredit } from '@/components/dashboard/transfert/jackpotToCredit';
import { LevelToRecovery } from '@/components/dashboard/transfert/levelToRecovery';
import { Card } from '@/components/ui/card';
import { CurrentProfile } from '@/hooks/own-current-user';
//
const Transfer = async ({ profileId }: { profileId: string }) => {
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const connected = await CurrentProfile()
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
              <div className='space-y-5'>
                <p className='text-center text-slate-500 text-md md:text-lg font-semibold'>
                  Transférer la cagnotte vers le crédit
                </p>
                {connected && (<JackpotToCredit profileId={connected?.id}/>)}
              </div> 
            </Card>
            <Card className='bg-white p-4 shadow-lg shadow-blue-200'>
              <div className='space-y-5'>
                <p className='text-center text-slate-500 text-md md:text-lg font-semibold'>
                  Définir un seuil de retrait de cagnotte
                </p>
                {connected && (<LevelToRecovery profileId={connected?.id}/>)}
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

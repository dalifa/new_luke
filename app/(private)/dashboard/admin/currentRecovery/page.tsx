//
import { ScrollArea } from '@/components/ui/scroll-area';
import { CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import { decrypt } from '@/lib/utils';
import Link from 'next/link';
import { redirect } from 'next/navigation';
//
const CurrentRecovery = async () => {
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const connected = await CurrentProfile()
  // s'il n'est pas connecté
  if(!connected)
  {
    return redirect ("/")
  }
  // s'il est connecté mais n'est pas ADMIN
  if(connected?.role !== "ADMIN")
  {
    return redirect ("/dashboard")
  }
  // tous ceux qui ont jackpot >= au seuil de retrait choisi
  const recovers = await prismadb.profile.findMany({
    where: { 
      awaitingRecovery: true
    },
    select: { 
      id: true,
      jackpot: true,
      codepin: true,
      username: true,
      encryptedPhone: true,
      currency: true
     } // 
  })
  //
  return ( 
    <div className='h-full flex items-center flex-col'>
      <div className='mx-4 lg:mx-0 text-lg border-2 border-slate-200 rounded-md p-4'>
        <p className='text-center text-blue-500 font-medium'>Les Jackpots supérieurs ou égaux au Level Recovery</p>
      </div>
      <div className='w-full md:w-4/5 lg:w-3/5 flex flex-col items-center mx-4 lg:my-10 p-4'>
        <ScrollArea className='w-full h-full border-2 border-slate-200 gap-4'>
          { recovers.map((recover) =>(
            <div key={recover?.id} className='grid grid-cols-1 lg:grid-cols-2'>
              <Link href={`/dashboard/admin/${recover?.id}`}>
                <div>
                  <p>{recover?.username}</p>
                  <p>{recover?.codepin}</p>
                </div>
                <div>
                  <p>{decrypt(recover?.encryptedPhone)}</p>
                  <p>{recover?.jackpot}{recover?.currency}</p>
                </div>
              </Link>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
//
export default CurrentRecovery

//
import { SearchBar } from '@/components/admin/searchBar'
import { CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import { UpdateMaxDisplays } from './[memberManagedId]/_component/manage-Max-Displays'
import { AdminSubscriptionManager } from '@/components/admin/manage-subscription'
// 
const Admin = async () => {
  //
  const connected = CurrentProfile()
  //
  const currentMaxDisplays = await prismadb.metric.findFirst()
  //
  const recipient = await prismadb.canBeBlessed.findFirst({
    where: { 
      canBeDisplayed: true
    },
    include: {
      profile: true
    },
  })
  //

  //
  return (
    <div className='flex w-full h-full flex-col'>
      <div className='flex items-center justify-center pb-4 border-b-2 border-slate-200'>
        <SearchBar/>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 m-4'>
        <div className='flex flex-col items-center justify-center gap-y-4 p-4 border-2 border-slate-200 rounded-md'>
          <p className='text-xl'>Nombre de Personnes par liste</p>
          <p className='text-2xl text-blue-500 font-medium'>{currentMaxDisplays?.maxDisplays}</p>
          <div className=''>
            <UpdateMaxDisplays/>
          </div>
        </div>
        <div className=' flex items-center justify-center border-2 border-slate-200 rounded-md'>
          <AdminSubscriptionManager/>
        </div>
        
        <div className='border-2 border-slate-200 rounded-md'>nombre d&apos;inscrit au total</div>
        <div className='border-2 border-slate-200 rounded-md'>nombre d&apos;inscrit dans le mois</div>

        <div className='border-2 border-slate-200 rounded-md'>montant total donné depuis le début</div>
        <div className='border-2 border-slate-200 rounded-md'>montant total donné dans le mois</div>

        <div className='border-2 border-slate-200 rounded-md'>combien ont reçu depuis le debut</div>
        <div className='border-2 border-slate-200 rounded-md'>combien on reçu dans le mois</div>

        <div className='border-2 border-slate-200 rounded-md p-2'>
          {
            recipient &&
              <div key={recipient?.id} className='text-xl mb-4'>
                <p className=''>
                  Pseudo: <span className='text-blue-500'>{recipient?.profile?.username} </span>
                </p>
                <p>MaxD: <span className='text-blue-500'>{recipient?.maxDisplays}</span></p>
                <p>Nod: {recipient?.nbrOfDisplays}</p>
                <p>Affichable: {recipient?.canBeDisplayed === true && (<span>true</span>)}</p>
              </div>
          }
        </div>
      </div>
    </div>
  )
}
//
export default Admin

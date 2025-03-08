//
import { SearchBar } from '@/components/admin/searchBar'
import { CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import Link from 'next/link'
// 
const Admin = async () => {
  //
  const connected = CurrentProfile()
  // Nbre total de recovery
  const nbrOfrecovery = await prismadb.profile.count({
    where: { 
      awaitingRecovery: true
    }
  })
  //
  return (
    <div className='flex w-full h-full flex-col'>
      <div className='flex items-center justify-center pb-4 border-b-2 border-slate-200'>
        <SearchBar/>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 m-4'>
        
        <div className='flex flex-col items-center justify-center gap-y-2 p-4 border-2 border-slate-200 rounded-md'>
          <Link href={"/dashboard/admin/currentRecovery"}>
            <p className='text-2xl font-semibold'>{nbrOfrecovery}</p>
          </Link>
          <p>Recoveries</p>
        </div>
        <div className='border-2 border-slate-200 rounded-md'>abonnement à jour dans le mois</div>
        
        <div className='border-2 border-slate-200 rounded-md'>nombre d'inscrit au total</div>
        <div className='border-2 border-slate-200 rounded-md'>nombre d'inscrit dans le mois</div>

        <div className='border-2 border-slate-200 rounded-md'>montant total donné depuis le début</div>
        <div className='border-2 border-slate-200 rounded-md'>montant total donné dans le mois</div>

        <div className='border-2 border-slate-200 rounded-md'>combien ont reçu depuis le debut</div>
        <div className='border-2 border-slate-200 rounded-md'>combien on reçu dans le mois</div>

        <div className='border-2 border-slate-200 rounded-md'>jackpot retiré dans le mois</div>
        <div className='border-2 border-slate-200 rounded-md'>jackpot total pas encore retiré</div>

      </div>
    </div>
  )
}
//
export default Admin

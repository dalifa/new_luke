//
import { PotentialForDev } from '@/components/admin/add-potential-recipient-dev'
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
  const amount = await prismadb.amount.findFirst({
    where: { rank: "one" }
  })
  //
  const potentialRecipients = await prismadb.canBeBlessed.findMany({
    where: { 
      amountId: amount?.id,
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

        <div className='border-2 border-slate-200 rounded-md'>
          {
            potentialRecipients.map((recipient) => (
              <p key={recipient?.id} className='text-blue-600 text-xl m-2 font-semibold'>
                {recipient?.profile?.username} <br/>
                {recipient?.amountId} <br/>
                {recipient?.currency} <br/>
                {recipient?.maxDisplays} <br/>
                {recipient?.nbrOfDisplays} <br/>
                {recipient?.canBeDisplayed === true && (<span>true</span>)}
              </p>
            ))
          }
        </div>
        <div className='border-2 border-slate-200 rounded-md'>
          <PotentialForDev/>
        </div>
      </div>
    </div>
  )
}
//
export default Admin

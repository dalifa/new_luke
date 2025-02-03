//
import { auth } from '@/auth';
import { CollectionsInProgress } from '@/components/dashboard/collections-in-progress';
import { Counters } from '@/components/dashboard/counters';
import { MyOpenTripl } from '@/components/dashboard/enter-in-collection/tripl/my-open-tripl';
import { TriplCollectionEnter } from '@/components/dashboard/enter-in-collection/tripl/tripl-collection-enter';
//
import { prismadb } from '@/lib/prismadb';
import { redirect } from 'next/navigation';
//
const Dashboard = async () => {
  const session = await auth();
  const sessionEmail = await prismadb.user.findFirst({
    where: { email: session?.user?.email}
  })
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const connectedCount = await prismadb.profile.count({
    where: { hashedEmail: sessionEmail?.hashedEmail }
  })
  // Si le mail hashé du connecté n'est pas dans la table Profile
  if(connectedCount === 0)
  {
    redirect("/dashboard/profile")
  }
  //
  //
  return (
    <div className='lg:pt-5 h-ull flex items-center flex-col bg-white'>
      <div className='w-full md:w-4/5 flex flex-col items-center m-4 gap-y-4 px-5 lg:pb-20'>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
          {/* crédit et cagnotte */}
            <Counters/> 
          {/* collectes en cours sur le site */}
            <CollectionsInProgress/> 
          {/* pour entrer dans un tripl */}
            <TriplCollectionEnter/>
          {/* my open tripl */}  
            <MyOpenTripl/>       
        </div> 
      </div>
    </div>
  )
}
//
export default Dashboard

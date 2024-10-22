

import { auth } from '@/auth';
import { CollectionEnter } from '@/components/dashboard/collection-enter';
import { CollectionsInProgress } from '@/components/dashboard/collections-in-progress';
import { Counters } from '@/components/dashboard/counters';
import { SnippetsCollectionEnter } from '@/components/dashboard/enter-in-collection/snippets-collection-enter';
import { TotalityCollectionEnter } from '@/components/dashboard/enter-in-collection/totality-collection-enter';
import { Card } from '@/components/ui/card';
import { currentUserInfos } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';
import { redirect } from 'next/navigation';
//
const Dashboard = async () => {
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const session = await auth()
  // s'il n'a pas encore renseigné son profil, on l'y redirect
  const profilExist = await prismadb.profile.count({
    where:{
      googleEmail: session?.user?.email
    }
  })
  //  
  if(profilExist === 0)
  {
    return redirect("/dashboard/profil")
  }
  // le connecté
  const connected = await prismadb.profile.findFirst({
    where: { googleEmail: session?.user?.email }
  })
  // code de demande de transfert
  const myRecoveries = await prismadb.transferDemand.findMany({
    where: {
      email: connected?.googleEmail,  // en prod
      isUsed: false
    }
  })
  // y a t-il une collecte tripl d'ouverte ?
  const openTriplExist = await prismadb.collection.count({
    where: { 
      isCollectionClosed: false,
      collectionType: "tripl"
    }
  })
  // y a t-il une collecte tripl d'ouverte ?
  const openSnippetsExist = await prismadb.collection.count({
    where: { 
      isCollectionClosed: false,
      collectionType: "snippets"
    }
  })
  // y a t-il une collecte tripl d'ouverte ?
  const openTotalityExist = await prismadb.collection.count({
    where: { 
      isCollectionClosed: false,
      collectionType: "totality"
    }
  })
  // myAllOpenTripl
  const myAllOpenTripl = await prismadb.collection.findMany({
    where: {
      isCollectionClosed: false,
      collectionType: "tripl",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  // my All Open snippets
  const myAllOpenSnippets = await prismadb.collection.findMany({
    where: {
      isCollectionClosed: false,
      collectionType: "snippet",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  // my All Open totality
  const myAllOpenTotalities = await prismadb.collection.findMany({
    where: {
      isCollectionClosed: false,
      collectionType: "totality",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  //
  return (
    <div className='pt-14 h-ull flex items-center flex-col bg-white'>
      <div className='w-full md:w-4/5 flex flex-col items-center gap-y-4 m-4 px-5 lg:py-20'>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
          {/* compteur déjà ouverte */}
            <Counters/> 
          {/* tripl en cours sur le site */}
            <CollectionsInProgress/> 
          {/* pour entrer dans un tripl */}
            <CollectionEnter/> 
          {/* ******* */}
          <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
            <p className='text-center mb-3 font-semibold text-slate-800 text-md lg:text-lg'>
              Vos Tripl
            </p>
            {/* my collections ici, on map les ownId */}
            {
              openTriplExist === 0 && (
                <p className='text-slate-600 text-center'>Vous n&apos;avez pas de tripl en cours.</p>
              )
            }
            {
              myAllOpenTripl && (
                <div className='grid grid-cols-2'>
                  {
                    myAllOpenTripl.map((myOpenTripl) => (
                      <Link key={myOpenTripl.id} href={`/dashboard/${myOpenTripl.id}`}>
                        <div className='text-md rounded-md bg-green-500 p-2 m-2 text-white text-center'>
                          <p className='font-semibold'>Tripl 
                            de {myOpenTripl?.amount}€</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )
            }    
          </Card>

          {/* SNIPPETS */}
          <SnippetsCollectionEnter/> 
          {/* ******* */}
          <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
            <p className='text-center mb-3 font-semibold text-slate-800 text-md lg:text-lg'>
              Vos Collectes Snippets
            </p>
            {/* my collections ici, on map les ownId */}
            {
              openSnippetsExist === 0 && (
                <p className='text-slate-600 text-center mt-10'>Vous n&apos;avez pas de collecte Snippets en cours.</p>
              )
            }
            {
              myAllOpenSnippets && (
                <div className='grid grid-cols-2'>
                  {
                    myAllOpenSnippets.map((myOpenSnippet) => (
                      <Link key={myOpenSnippet.id} href={`/dashboard/snippets/${myOpenSnippet.id}`}>
                        <div className='text-md rounded-md bg-green-500 p-2 m-2 text-white text-center'>
                          <p className='font-semibold'>Snippets n°{myOpenSnippet.id } - 
                            De {myOpenSnippet?.amount}€</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )
            }    
          </Card>

          {/* TOTALITY */}
          <TotalityCollectionEnter/> 
          {/* ******* */}
          <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
            <p className='text-center mb-3 font-semibold text-slate-800 text-md lg:text-lg'>
              Vos Collectes Totality
            </p>
            {/* my collections ici, on map les ownId */}
            {
              openTotalityExist === 0 && (
                <p className='text-slate-600 text-center mt-10'>Vous n&apos;avez pas de collecte Totality en cours.</p>
              )
            }
            {
              myAllOpenTotalities && (
                <div className='grid grid-cols-2'>
                  {
                    myAllOpenTotalities.map((myOpenTotality) => (
                      <Link key={myOpenTotality.id} href={`/dashboard/totality/${myOpenTotality.id}`}>
                        <div className='text-md rounded-md bg-green-500 p-2 m-2 text-white text-center'>
                          <p className='font-semibold'>Totality n°{myOpenTotality.id} - 
                            De {myOpenTotality?.amount}€</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )
            }    
          </Card>
        </div> 
      </div>
    </div>
  )
}

export default Dashboard

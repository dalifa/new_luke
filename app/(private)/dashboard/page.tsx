

import { auth } from '@/auth';
import { CollectionsInProgress } from '@/components/dashboard/collections-in-progress';
import { Counters } from '@/components/dashboard/counters';
import { DdcListEnter } from '@/components/dashboard/enter-in-collection/ddcList/ddc-collection-enter';
import { DonationChallengeStats } from '@/components/dashboard/enter-in-collection/ddcList/donation-challenge-stats';
import { MyOpenDdc } from '@/components/dashboard/enter-in-collection/ddcList/my-open-ddc';
import { SnippetsCollectionEnter } from '@/components/dashboard/enter-in-collection/snippets/snippets-collection-enter';
import { TotalityCollectionEnter } from '@/components/dashboard/enter-in-collection/totality/totality-collection-enter';
import { TriplCollectionEnter } from '@/components/dashboard/enter-in-collection/tripl/tripl-collection-enter';

import { Card } from '@/components/ui/card';
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
  // y a t-il une collecte tripl d'ouverte ?
  const openTriplExist = await prismadb.collection.count({
    where: { 
      isCollectionClosed: false,
      collectionType: "tripl",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    }
  })
  // y a t-il une collecte snippets d'ouverte ?
  const openSnippetsExist = await prismadb.collection.count({
    where: { 
      isCollectionClosed: false,
      collectionType: "snippets",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    }
  })
  // y a t-il une collecte totality d'ouverte ?
  const openTotalityExist = await prismadb.collection.count({
    where: { 
      isCollectionClosed: false,
      collectionType: "totality",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
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
      collectionType: "snippets",
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
        some: { profileId: connected?.id }
      }
    },
  })
  //
  return (
    <div className='lg:pt-5 h-ull flex items-center flex-col bg-white'>
      <div className='w-full md:w-4/5 flex flex-col items-center m-4 gap-y-4 px-5 lg:pb-20'>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
          {/* crédit et cagnotte */}
            <Counters/> 
          {/* collectes en cours sur le site 
            <CollectionsInProgress/> */}
          {/* #### DIRECT DONATION CHALLENGE ####  */}
            <DonationChallengeStats/>
            <DdcListEnter/>
            <MyOpenDdc/>  
          {/* #### FIN DDC LIST ###*/}
          {/* pour entrer dans un tripl 
            <TriplCollectionEnter/>
          <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
            <p className='text-center mb-3 font-semibold text-slate-800 text-md lg:text-lg'>
              Vos Tripl
            </p>
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
                      <Link key={myOpenTripl.id} href={`/dashboard/tripl/${myOpenTripl.id}`}>
                        <div className='text-md rounded-md bg-green-500 p-2 m-2 text-white text-center'>
                          <p className='font-semibold'>Tripl de {myOpenTripl?.amount}€</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )
            }    
          </Card> */}

          {/* SNIPPETS 
          <SnippetsCollectionEnter/> 
          <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
            <p className='text-center mb-3 font-semibold text-slate-800 text-md lg:text-lg'>
              Vos Collectes Snippets
            </p>
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
                          <p className='font-semibold'>Snippets de {myOpenSnippet?.amount}€</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )
            }    
          </Card>  */}

          {/* TOTALITY * /}
          <TotalityCollectionEnter/> */}
          {/* ******* * /}
          <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
            <p className='text-center mb-3 font-semibold text-slate-800 text-md lg:text-lg'>
              Vos Collectes Totality
            </p>
            {/* my collections totality * /}
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
                          <p className='font-semibold'>Totality de {myOpenTotality?.amount}€</p>
                        </div>
                      </Link>
                    ))
                  }
                </div>
              )
            }   
          </Card>  */}
          
        </div> 
      </div>
    </div>
  )
}

export default Dashboard

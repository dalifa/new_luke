
import { CollectionsInProgress } from '@/components/dashboard/collections-in-progress';
import { Counters } from '@/components/dashboard/counters';
import { CollectionEnter } from '@/components/dashboard/enter-in-collection/collection-enter';
import { Card } from '@/components/ui/card';
import { amountFive, amountFour, amountOne, amountSeven, amountSix, amountThree, amountTwo, currentUser, currentUserInfos } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';
import { redirect } from 'next/navigation';
//
const Dashboard = async () => {
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const connectedProfile:any = await currentUserInfos()
  const One = await amountOne()
  const Two = await amountTwo()
  const Three = await amountThree()
  const Four = await amountFour()
  const Five = await amountFive()
  const Six = await amountSix()
  const Seven = await amountSeven()

  // mes codes de demande de transfert
  const myRecoveries = await prismadb.transferDemand.findMany({
    where: {
      usercodepin: connectedProfile?.usercodepin,  // en prod
      isUsed: false
    }
  })
  // y a t-il une collecte totality d'ouverte ?
  const openCollectionExist = await prismadb.collectionList.count({
    where: { 
      currency: connectedProfile?.currency,
      collectionType: "totality",
      isGroupComplete: false
    }
  })
  // mes collectes de amount one
  const myAmountOneCollections = await prismadb.collection.findMany({
    where: { 
      collectionType: "totality",
      usercodepin: connectedProfile?.usercodepin, // en prod
      email: connectedProfile?.googleEmail,
      amount: One?.amount,
      currency: One?.currency,
      isCollectionClosed: false
    }
  })
  // mes collectes de amount two
  const myAmountTwoCollections = await prismadb.collection.findMany({
    where: { 
      collectionType: "totality",
      usercodepin: connectedProfile?.usercodepin, // en prod
      email: connectedProfile?.googleEmail,
      amount: Two?.amount,
      currency: Two?.currency,
      isCollectionClosed: false
    }
  })
  // mes collectes totality de amount three
  const myAmountThreeCollections = await prismadb.collection.findMany({
    where: { 
      collectionType: "totality",
      usercodepin: connectedProfile?.usercodepin, // en prod
      email: connectedProfile?.googleEmail,
      amount: Three?.amount,
      currency: Three?.currency,
      isCollectionClosed: false
    }
  })
  // mes collectes totality de amount four
  const myAmountFourCollections = await prismadb.collection.findMany({
    where: { 
      collectionType: "totality",
      usercodepin: connectedProfile?.usercodepin, // en prod
      email: connectedProfile?.googleEmail,
      amount: Four?.amount,
      currency: Four?.currency,
      isCollectionClosed: false
    }
  })
  // mes collectes totality de amount five
  const myAmountFiveCollections = await prismadb.collection.findMany({
    where: { 
      collectionType: "totality",
      usercodepin: connectedProfile?.usercodepin, // en prod
      email: connectedProfile?.googleEmail,
      amount: Five?.amount,
      currency: Five?.currency,
      isCollectionClosed: false
    }
  })
  // mes collectes totality de amount six
  const myAmountSixCollections = await prismadb.collection.findMany({
    where: { 
      collectionType: "totality",
      usercodepin: connectedProfile?.usercodepin, // en prod
      email: connectedProfile?.googleEmail,
      amount: Six?.amount,
      currency: Six?.currency,
      isCollectionClosed: false
    }
  })
  // mes collectes totality de amount seven
  const myAmountSevenCollections = await prismadb.collection.findMany({
    where: { 
      collectionType: "totality",
      usercodepin: connectedProfile?.usercodepin, // en prod
      email: connectedProfile?.googleEmail,
      amount: Seven?.amount,
      currency: Seven?.currency,
      isCollectionClosed: false
    }
  })
  // vérification s'il a répondu aux questions
  const verifiedQuestion = await prismadb.response.count({
    where: {
      googleEmail: connectedProfile?.email,
      response1: true,
      response2: true,
      response3: true,
      //response4: true,
      //response5: true
    }
  })
  //
  const currentSession = await currentUser()
  const profilCount = await prismadb.profile.count({
    where: {
      googleEmail: currentSession?.email
    }
  })
  // s'il n'a pas encore renseigné son profil
  if(profilCount < 1)
  {
    return redirect("/dashboard/profil")
  }
  if(verifiedQuestion < 1)
  {
    return redirect("/dashboard/questions")
  }
  // 
  return (
    <div className='h-ull flex items-center flex-col bg-white'>
      <div className='w-full md:w-4/5 flex flex-col items-center gap-y-4 m-4 p-5 lg:pt-10'>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
            <Counters/>          
            <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
              <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>
                Collectes en cours
              </p>
              <CollectionsInProgress/>
            </Card>
            {/*    )} */}                  
            <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
              <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>
                Participer à une collecte
              </p>
                <CollectionEnter/>
            </Card> 
            {/* COLLECTION TOTALITY */}
            <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
              <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>
                Vos collectes
              </p>
              {/* my collections ici, on map les ownId */}
              {
                myAmountOneCollections && (
                  <div>
                    {
                      myAmountOneCollections.map((myAmountOneCollection) => (
                        <Link key={myAmountOneCollection.id} href={`/dashboard/${myAmountOneCollection.id}`}>
                          <div className='text-md rounded-md bg-blue-500 p-2 m-2 text-white text-center'>
                            <p className='font-semibold'>Collecte N°: { myAmountOneCollection.ownId } - 
                              De: { myAmountOneCollection.amount}{myAmountOneCollection.currency}</p>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                )
              }
              {/* two */}
              {
                myAmountTwoCollections && (
                  <div>
                    {
                      myAmountTwoCollections.map((myAmountTwoCollection) => (
                        <Link key={myAmountTwoCollection.id} href={`/dashboard/${myAmountTwoCollection.id}`}>
                          <div className='text-md rounded-md bg-blue-500 p-2 m-2 text-white text-center'>
                            <p className='font-semibold text-center'>Collecte N°: { myAmountTwoCollection.ownId } - 
                              De: { myAmountTwoCollection.amount}{myAmountTwoCollection.currency}</p>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                )
              }
              {/* three */}
              {
                myAmountThreeCollections && (
                  <div>
                    {
                      myAmountThreeCollections.map((myAmountThreeCollection) => (
                        <Link key={myAmountThreeCollection.id} href={`/dashboard/${myAmountThreeCollection.id}`}>
                          <div className='text-md rounded-md bg-blue-500 p-2 m-2 text-white text-center'>
                            <p className='font-semibold text-center'>Collecte N°: { myAmountThreeCollection.ownId } - 
                              De: { myAmountThreeCollection.amount}{myAmountThreeCollection.currency}</p>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                )
              }
              {
                myAmountFourCollections && (
                  <div>
                    {
                      myAmountFourCollections.map((myAmountFourCollection) => (
                        <Link key={myAmountFourCollection.id} href={`/dashboard/${myAmountFourCollection.id}`}>
                          <div className='text-md rounded-md bg-blue-500 p-2 m-2 text-white text-center'>
                            <p className='font-semibold text-center'>Collecte N°: { myAmountFourCollection.ownId } - 
                              De: { myAmountFourCollection.amount}{myAmountFourCollection.currency}</p>
                          </div>
                        </Link>
                      ))
                    }
                  </div>
                )
              }
            </Card>
          </div> 
          {/*   <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
            <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
              <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'> Statistiques des collections</p>
            </Card>
          </div>  */}
        </div>
      </div>
    )
}

export default Dashboard

import { auth } from '@/auth';
import { CollectionEnter } from '@/components/dashboard/collection-enter';
import { CollectionsInProgress } from '@/components/dashboard/collections-in-progress';
import { Counters } from '@/components/dashboard/counters';
import { Card } from '@/components/ui/card';
import { currentUserInfos } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';

const Dashboard = async () => {
    // la redirection pour les non connectés est faite depuis le fichier middleware
    const connectedProfile = await currentUserInfos()

    // on select les amounts selon la currency du connecté
    const amountOne = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency, // en prod
            rank: "one"
         }
    })
    const amountTwo = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency, // en prod
            rank: "two"
         }
    })
    const amountThree = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency, // en prod
            rank: "three"
         }
    })
    const amountFour = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency, // en prod
            rank: "four"
         }
    })
    // mes collectes de amount one
    const myAmountOnecollections = await prismadb.collection.findMany({
        where: { 
            usercodepin: connectedProfile?.usercodepin, // en prod
            email: connectedProfile?.googleEmail,
            amount: amountOne?.amount,
            currency: amountOne?.currency,
            isCollectionClosed: false
        }
    })
    // mes collectes de amount two
    const myAmountTwocollections = await prismadb.collection.findMany({
        where: { 
            usercodepin: connectedProfile?.usercodepin, // en prod
            email: connectedProfile?.googleEmail,
            amount: amountTwo?.amount,
            currency: amountTwo?.currency,
            isCollectionClosed: false
        }
    })
    // mes collectes de amount three
    const myAmountThreecollections = await prismadb.collection.findMany({
        where: { 
            usercodepin: connectedProfile?.usercodepin, // en prod
            email: connectedProfile?.googleEmail,
            amount: amountThree?.amount,
            currency: amountThree?.currency,
            isCollectionClosed: false
        }
    })
    // mes collectes de amount four
    const myAmountFourcollections = await prismadb.collection.findMany({
        where: { 
            usercodepin: connectedProfile?.usercodepin, // en prod
            email: connectedProfile?.googleEmail,
            amount: amountFour?.amount,
            currency: amountFour?.currency,
            isCollectionClosed: false
        }
    })
    // code de demande de transfert
    const myRecoveries = await prismadb.transferDemand.findMany({
        where: {
            usercodepin: connectedProfile?.usercodepin,  // en prod
            isUsed: false
        }
    })
    // y t-il une collecte d'ouverte ?
    const openCollectionExist = await prismadb.collectionList.count({
        where: { 
            currency: connectedProfile?.currency,
            collectionType: "snippet",
            isGroupComplete: false
        }
    })


    return (
        <div className='h-ull flex items-center flex-col'>
            <div className='w-full md:w-4/5 flex flex-col items-center gap-y-4 m-4 px-5'>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                    <Counters/>
                    { openCollectionExist > 0 && (
                        <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
                            <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>
                                Collectes en cours
                            </p>
                            <CollectionsInProgress/>
                        </Card>
                    )}
                    
                    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
                        <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>Participer à une collecte</p>
                        <CollectionEnter/>
                    </Card> 
                </div>

                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
                        <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>Vos collectes Snippet</p>
                        {/* my collections ici, on map les ownId */}
                        {
                            myAmountOnecollections && (
                                <div>
                                {
                                    myAmountOnecollections.map((myAmountOnecollection) => (
                                    <Link key={myAmountOnecollection.id} href={`/dashboard/${myAmountOnecollection.id}`}>
                                      <div className='text-md rounded-md bg-green-700 p-2 m-2 text-white text-center'>
                                        <p className='font-semibold'>Collecte N°: { myAmountOnecollection.ownId } - 
                                        De: { myAmountOnecollection.amount}{myAmountOnecollection.currency}</p>
                                      </div>
                                    </Link>
                                    ))
                                }
                                </div>
                            )
                        }
                        {
                            myAmountTwocollections && (
                                <div>
                                {
                                    myAmountTwocollections.map((myAmountTwocollection) => (
                                    <Link key={myAmountTwocollection.id} href={`/dashboard/${myAmountTwocollection.id}`}>
                                      <div className='text-md rounded-md bg-green-700 p-2 m-2 text-white text-center'>
                                        <p className='font-semibold text-center'>Collecte N°: { myAmountTwocollection.ownId } - 
                                        De: { myAmountTwocollection.amount}{myAmountTwocollection.currency}</p>
                                      </div>
                                    </Link>
                                    ))
                                }
                                </div>
                            )
                        }
                        {
                            myAmountThreecollections && (
                                <div>
                                {
                                    myAmountThreecollections.map((myAmountThreecollection) => (
                                    <Link key={myAmountThreecollection.id} href={`/dashboard/${myAmountThreecollection.id}`}>
                                      <div className='text-md rounded-md bg-green-700 p-2 m-2 text-white text-center'>
                                        <p className='font-semibold text-center'>Collecte N°: { myAmountThreecollection.ownId } - 
                                        De: { myAmountThreecollection.amount}{myAmountThreecollection.currency}</p>
                                      </div>
                                    </Link>
                                    ))
                                }
                                </div>
                            )
                        }
                        {
                            myAmountFourcollections && (
                                <div>
                                {
                                    myAmountFourcollections.map((myAmountFourcollection) => (
                                    <Link key={myAmountFourcollection.id} href={`/dashboard/${myAmountFourcollection.id}`}>
                                      <div className='text-md rounded-md bg-green-700 p-2 m-2 text-white text-center'>
                                        <p className='font-semibold text-center'>Collecte N°: { myAmountFourcollection.ownId } - 
                                        De: { myAmountFourcollection.amount}{myAmountFourcollection.currency}</p>
                                      </div>
                                    </Link>
                                    ))
                                }
                                </div>
                            )
                        }
                    </Card>
                    {/* COLLECTION TOTALITY */}
                    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
                        <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>Vos collectes Totality</p>
                    </Card>
                </div> 

                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
                        <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'> Statistiques des collections</p>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

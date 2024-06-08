import { auth } from '@/auth';
import { Card } from '@/components/ui/card';
import { currentUserInfos } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';
// pour forma date
import { format } from "date-fns"
// on crée une constance pour date
const DATE_FORMAT = "d MMM yyyy"

const History = async () => {
    const connectedProfile = await currentUserInfos()
    const myClosedCollections = await prismadb.collection.findMany({
        take: 20, // 50
        where: { 
            usercodepin: connectedProfile?.usercodepin,
            isCollectionClosed: true
        },
        orderBy: { ownId: "desc"}
    })
    return (
        <div className='h-ull flex items-center flex-col'>
            <div className='w-full md:w-4/5 flex flex-col items-center gap-y-4 m-4 px-5'>
                <Card className='w-full p-2 mb-8 text-center bg-blue-200 text-slate-700 text-md lg:text-lg shadow-lg shadow-slate-200'>
                    Toutes vos collectes cloturées
                </Card>
                <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
                  {
                    myClosedCollections.map((myClosedCollection) => (
                      <Link href={`/dashboard/historique/${myClosedCollection.id}`} key={myClosedCollection.id}>
                        <Card className='flex items-center flex-col shadow-lg shadow-slate-300 p-4 text-center gap-y-2'>
                          <p className='text-sm lg:text-md font-semibold text-blue-800'>
                            Collecte { myClosedCollection?.collectionType }
                          </p>
                          <p className='text-sm lg:text-md font-semibold text-slate-600'>n°: {myClosedCollection.ownId}</p>
                          <p className='text-sm lg:text-md font-semibold text-slate-600'>
                            De: { myClosedCollection.amount}{myClosedCollection.currency}
                          </p>
                          <p className='text-xs text-gray-500'>Du: {format(new Date(myClosedCollection.createdAt), DATE_FORMAT)}</p>
                        </Card>
                      </Link>
                    ))
                  }
                </div>
            </div>
        </div>
    )
}

export default History

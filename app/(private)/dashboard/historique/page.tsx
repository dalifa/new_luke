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
      <div className='h-full flex items-center justify-center flex-col pt-10 px-5  gap-5 bg-white'>
        <div className='w-4/5 lg:w-2/5 p-3 border rounded text-center bg-white shadow-md shadow-blue-100'>
          <p className='text-slate-700 text-center text-md lg:text-lg'>
            Toutes vos collectes clôturées
          </p>
        </div>
        <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
          {
            myClosedCollections.map((myClosedCollection) => (
              <Link href={`/dashboard/historique/${myClosedCollection.id}`} key={myClosedCollection.id}>
                <Card className='flex items-center flex-col shadow-lg shadow-blue-100 p-4 text-center gap-y-2'>
                  
                  <p className='text-sm lg:text-md font-medium text-slate-600'>{myClosedCollection?.collectionType} n°: {myClosedCollection.ownId}</p>
                  <p className='text-sm lg:text-md font-medium text-slate-600'>
                    De: { myClosedCollection.amount}{myClosedCollection.currency}
                  </p>
                  <p className='text-xs text-gray-500'>Du: {format(new Date(myClosedCollection.createdAt), DATE_FORMAT)}</p>
                </Card>
              </Link>
            ))
          }
        </div>
      </div>
    )
}

export default History

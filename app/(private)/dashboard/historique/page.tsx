import { auth } from '@/auth';
import { Card } from '@/components/ui/card';
import { capitalize, CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';
// pour forma date
import { format } from "date-fns"
// on crée une constance pour date
const DATE_FORMAT = "d MMM yyyy"

const History = async () => {
    const connectedProfile = await CurrentProfile()
    const myClosedCollections = await prismadb.collectionParticipant.findMany({
        take: 20, // 50
        where: { 
          profileId: connectedProfile?.id,
        },
        include: {
          collection: true
        },
        orderBy: { id: "desc"}
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
              <>
              {
                myClosedCollection?.collection?.isCollectionClosed === true && (
                  <Link href={`/dashboard/historique/${myClosedCollection?.collection?.id}`} key={myClosedCollection?.collection?.id}>
                    <Card className='flex items-center flex-col shadow-lg shadow-blue-100 p-4 text-center gap-y-2'>
                      {myClosedCollection?.collection?.collectionType === "tripl" && (
                        <p className='text-sm lg:text-md font-medium text-blue-500'>{capitalize(myClosedCollection?.collection?.collectionType)}</p>
                      )}
                      {/* le montant */}
                      {myClosedCollection?.collection?.collectionType === "tripl" && (
                        <p className='text-sm lg:text-md font-medium text-blue-500'> 
                          De: {myClosedCollection?.collection?.amount}{myClosedCollection?.collection?.currency}
                        </p>
                      )}
                      <p className='text-xs text-gray-500'>Du: {format(new Date(myClosedCollection?.createdAt), DATE_FORMAT)}</p>
                    </Card>
                  </Link>
                )
              }
              </>
            ))
          }
        </div>
      </div>
    )
}

export default History

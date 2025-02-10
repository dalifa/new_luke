import { Card } from "@/components/ui/card"
import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
import Link from "next/link"

export async function MyOpenTripl() {
  // on select le profile du connecté
  const connected = await CurrentProfile()
  // y a t-il une collecte tripl d'ouverte ?
  const openTriplCount = await prismadb.collection.count({
    where: { 
      isCollectionClosed: false,
      collectionType: "tripl",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    }
  })
  // My All Open Tripl
  const myAllOpenTripl = await prismadb.collection.findMany({
    where: {
      isCollectionClosed: false,
      collectionType: "tripl",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  //
    return(
      <Card className='bg-white shadow-blue-100 shadow-md p-4'>
        <p className='text-center mb-3 font-semibold text-slate-600 text-xl lg:text-lg'>
          Vos Tripl
        </p> 
        <hr className='w-full mb-2'/>
        {
          openTriplCount === 0 && (
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
                      <p className='font-semibold'>Tripl de {myOpenTripl?.amount}{connected?.currency}</p>
                    </div>
                  </Link>
                ))
              }
            </div>
          )
        }    
      </Card>
    )
}
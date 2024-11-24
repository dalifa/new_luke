import { prismadb } from "@/lib/prismadb";
import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const MyOpenOneofus = async () => {
  const session = await auth()
  // vous avez donné combien depuis l'inscription
  // vous avez reçu combien depuis l'inscription
  //const connected:any = await currentUserInfos()
  // ##4 test##
  const connectedtestor = await prismadb.currentProfileForTest.findFirst()
  // ##4 test##
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: connectedtestor?.usercodepin}
  })
  // my open One Of Us collections
  const myOneOfUs = await prismadb.collection.findMany({
    where: {
      isCollectionClosed: false,
      collectionType: "oneofus",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  // y a t-il une collecte OneOfUS d'ouverte ?
  const openOneOfUsExist = await prismadb.collection.count({
    where: { 
      collectionType: "oneofus",
      isCollectionClosed: false,
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  // ###
  return (
    <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-500 text-md lg:text-lg'>
        Vos collectes One Of Us en cours...
      </p>
      <hr className='w-full mb-4'/>
      <div className=' bg-white'>
      {
        openOneOfUsExist === 0 && (
          <p className='text-slate-400 text-center'>Vous n&apos;avez pas de collecte One Of Us en cours.</p>
        )
      }
      {/* */}
      {
        myOneOfUs && (
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
          {
            myOneOfUs.map((oneofus) => (
              <Link key={oneofus.id} href={`/dashboard/oneofus/${oneofus.id}`}>
                <div className='text-md rounded-md bg-green-600 p-2 text-white text-center'>
                  <p className='font-semibold'>OneOfUs de {oneofus?.amount}{oneofus?.currency}</p>
                </div>
              </Link>
            ))
          }
          </div>
        )
      }    
      </div>
    </Card>
  ); 
};

/*
*/
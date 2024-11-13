
import { prismadb } from "@/lib/prismadb";
import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export const MyOpenDdc = async () => {
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
  // myDdc
  const myDdcs = await prismadb.collection.findMany({
    where: {
      isGroupComplete: false,
      isCollectionClosed: false,
      collectionType: "ddc",
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  // y a t-il une collecte DDC d'ouverte ?
  const openDdcExist = await prismadb.collection.count({
    where: { 
      collectionType: "ddc",
      isGroupComplete: false,
      collectionParticipants: {
        some: {profileId: connected?.id}
      }
    },
  })
  // ###
  return (
    <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-500 text-md lg:text-lg'>
        Vos DDC en cours...
      </p>
      <hr className='w-full mb-4'/>
      <div className=' bg-white'>
      {
        openDdcExist === 0 && (
          <p className='text-slate-400 text-center'>Vous n&apos;avez pas de DDC en cours.</p>
        )
      }
      {/* */}
      {
        myDdcs && (
          <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
          {
            myDdcs.map((myDdc) => (
              <Link key={myDdc.id} href={`/dashboard/ddc/${myDdc.id}`}>
                <div className='text-md rounded-md bg-green-600 p-2 m-2 text-white text-center'>
                  <p className='font-semibold'>Ddc de {myDdc?.amount}€</p>
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
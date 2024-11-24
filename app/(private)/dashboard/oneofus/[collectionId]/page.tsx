import { DdcAlsoReceiver } from "@/components/dashboard/action-in-collection/ddc/also-receiver"
import { DdcJustToGive } from "@/components/dashboard/action-in-collection/ddc/just-donator"
import { MyDdcProjectForm } from "@/components/dashboard/action-in-collection/ddc/myproject-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { capitalize } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
import { Ban, CircleUserRound, Gift, Handshake, HeartHandshake, Landmark, ToggleRight, UserRoundCheck } from "lucide-react"
import Link from "next/link"
import { GrMoney } from "react-icons/gr"

// FOR TEST WITH MODIFICATION 
const Collection = async ({
  params
}:{
  // collectionId = le nom du fichier s'il est différent, ça ne marche pas 
  params: { collectionId: string }
}) => {
  // le connecté
  //const connected = await currentUserInfos() // prod

  // ##4 test##
  const connectedtestor = await prismadb.currentProfileForTest.findFirst()
  // ##4 test##
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: connectedtestor?.usercodepin}
  })
  //
  const profiles = await prismadb.profile.findMany()
  // ### FIN 4 TEST ####

  // on select la OneofUs en cours
  const currentOneofus = await prismadb.collection.findFirst({
    where: { 
      id: params.collectionId,
      collectionType: "oneofus" // pour être sûr
      },
      include: {
        collectionParticipants: {
          include: {
          profile: true
        }
      }
    }
  })
  // On vérifie si le connecté a déjà donné dans cette collecte
  const hasGiveCount = await prismadb.collectionResult.count({
    where: {
      donatorProfileId: connected?.id,
      collectionId: params.collectionId,
    }
  })
  //
  const maxLength = 65 // max de caractères pour le projet
  // le nbre de ceux qui renoncer à recevoir
  const isOnlyDonatorCount = await prismadb.collectionParticipant.count({
    where: { 
      collectionId: params.collectionId, // id de la collecte
      isOnlyDonator: true
    }
  })
  //
  return (
    <div className='h-full flex items-center justify-center flex-col gap-5 bg-white'>
      {/* <div className='w-4/5 lg:w-2/5 p-3 mb-5 border rounded text-center bg-white shadow-md shadow-blue-100'> en prod */}
      <div className='w-4/5  p-3 mb-5 border rounded text-center bg-white shadow-md shadow-blue-100'>
        <p className='text-slate-600 text-center text-md lg:text-lg'>
          Participants à cette {currentOneofus?.collectionType} de {currentOneofus?.amount}{currentOneofus?.currency}
        </p>
        <hr className='my-2'/>
        <p>current profile 4 test: &nbsp;{connected?.username}&nbsp; - &nbsp; {connected?.usercodepin}</p>
        <div className='grid grid-cols-5 gap-2'>
          {
            profiles.map((prof) => (
              <div key={prof?.id} className='flex flex-col border-2 p-2 gap-2 rounded-md'>
                <p>{prof?.usercodepin}</p>
                <p>C:{prof?.credit} - J:{prof?.jackpot}</p>
              </div>
            ))
          }
        </div>
        {
          currentOneofus?.groupStatus !== currentOneofus?.group && (
            <div className='grid grid-cols-1 md:grid-cols-1 gap-y-2 font-medium'>
              <hr className='my-2'/>
              <p><span className='text-green-600'>{currentOneofus?.groupStatus}</span> sur {currentOneofus?.group}</p>
            </div>
          ) 
        }
      </div>
      <div className='w-4/5'>
        <div className='w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'>
        {/* POTENTIELS DONATAIRES AU DDC EN COURS */}
        {
          // les participants à la ddc en cours
          currentOneofus?.collectionParticipants.map((participant) =>(
            <Card key={participant.id} className='p-2 bg-white text-slate-600 shadow-lg shadow-blue-200'>
              <>
                <div className='grid grid-cols-1 gap-y-1'>
                  <div className='grid grid-cols-1 gap-y-2'>
                    <div className='flex flex-row items-center mb-2 gap-x-2'>
                      <div>
                        <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                          <AvatarImage src={participant?.profile.googleImage || ""} />
                          <AvatarFallback className="bg-slate-100">
                            <CircleUserRound className="text-violet-600 h-16 w-16 lg:h-24 lg:w-24" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className='flex w-full flex-col items-center gap-x-4 '>
                        <p className='text-lg lg:text-xl font-semibold'> {capitalize(participant?.profile?.username)} </p>
                        <p className='text-sm'>&nbsp;PIN:&nbsp;{participant?.profile?.usercodepin}</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col items-start gap-y-2'>
                    <div className='w-full flex flex-row items-center gap-2'>
                      <Landmark className='text-violet-600'/>
                      <div className='w-full'>
                        <p className='text-sm text-slate-500 font-medium'> {capitalize(participant?.profile.city)} </p>
                      </div>
                    </div>
                    <div className='w-full flex flex-row items-center gap-2'>
                      <UserRoundCheck className='text-violet-600'/>
                      <div className='w-full'>
                        <p className='text-sm text-slate-500'>{capitalize(participant?.profile?.bio.length > maxLength ? participant?.profile?.bio.substring(0, maxLength) + '...' : participant?.profile?.bio)}</p>
                      </div>
                    </div>
                    <div className='w-full flex flex-row items-center gap-2'>
                      {  
                        connected?.id === participant?.profileId ? (
                          <MyDdcProjectForm collectionId={params?.collectionId}/>
                        ):(
                          <Gift className='text-violet-600'/>
                        )
                      }
                      <div className='w-full'>
                        <p className='text-sm text-slate-500'>{capitalize(participant?.project.length > maxLength ? participant?.project.substring(0, maxLength) + '...' : participant?.project)}</p>
                      </div>
                    </div>           
                    { 
                      participant?.profileId === connected?.id && participant?.isOnlyDonator === true && (currentOneofus && currentOneofus?.group - 1 === isOnlyDonatorCount) && (
                        <div className='w-full flex flex-row items-center gap-2'>
                          <DdcAlsoReceiver collectionId={params.collectionId}/>
                          <p className='text-sm'>Juste donateur</p>
                        </div>
                      )
                    }  
                    {
                      participant?.profileId === connected?.id && participant?.isOnlyDonator === false && (
                        <div className='w-full flex flex-row items-center gap-2'>
                          {
                            currentOneofus && currentOneofus?.group - 1 === isOnlyDonatorCount ? (
                              <ToggleRight className='text-green-600'/>
                            ):(
                              <DdcJustToGive collectionId={params.collectionId}/>
                            )
                          }
                          <p className='text-sm'>Aussi donataire</p>
                        </div>
                      )
                    }
                    <hr className='w-full border-[1xp] my-0 border-violet-500'/>
                  </div> 
                </div>
                <div className='flex items-end justify-center mt-4 mx-2'>
                { 
                  /* le participant n'est pas le connecté */
                  participant?.profileId !== connected?.id ? (
                    <>
                    {
                      /* le participant ne veut pas recevoir de don */
                      participant?.isOnlyDonator === true ? (
                        <Button className='bg-red-400 hover:bg-red-500 rounded-md text-white'> 
                          A renoncé à recevoir <Ban className="h-5 w-5 cursor-pointer ml-2"/>
                        </Button>
                      ):(
                        /* le participant veut recevoir */
                        <>
                        {
                          hasGiveCount === 1 ? (
                            <Button className='bg-slate-400 hover:bg-slate-500 rounded-md text-white'>    
                              Merci pour le don <HeartHandshake className="h-5 w-5 cursor-pointer ml-2"/>
                            </Button>
                          ):(
                            <>
                            {
                              hasGiveCount < 1 && (
                                // le boutton donner ne s'affiche que sur ceux des participant qui n'ont pas déjà été
                                // donataire du connecté.
                                <>
                                {
                                  currentOneofus?.group === currentOneofus?.groupStatus ? (
                                    <Link href={`/dashboard/ddc/${params.collectionId}/${participant.id}`}>
                                      <Button variant={"violet"} className='rounded-md text-white'>    
                                        Donner avec joie <GrMoney className="h-5 w-5 cursor-pointer ml-2"/>
                                      </Button>
                                    </Link>
                                  ):(
                                    <>
                                    {
                                      currentOneofus && (
                                        <p className='text-slate-500 text-sm'>En construction ...</p>
                                      )
                                    }
                                    </>
                                  )
                                }
                                </>
                              )
                            } 
                            </>
                          )
                        }
                        </>
                      )
                    }
                    </> 
                  ):(
                    /* le participant ici c'est le connecté */
                    <>
                          {
                            /* il n'a pas donné dans cette collecte (il peut donné dans une collecte où il figure) */
                            hasGiveCount === 1 && (
                              /* il à donné dans cette collecte */
                              <Button className='bg-slate-400 hover:bg-slate-500 rounded-md text-white'> 
                                Vous avez déjà donné <Handshake className="h-5 w-5 cursor-pointer ml-2"/>
                              </Button>
                            )
                          }
                    </>
                  )
                }
                </div>
              </>
            </Card> 
          ))
        }
        </div>
      </div>
    </div>
  )
}
export default Collection


/*

*/
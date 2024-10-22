//
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { GrMoney } from "react-icons/gr";
import Link from 'next/link';
import { capitalize, currentUserInfos } from '@/hooks/own-current-user';
import { CircleUserRound, Gift, RefreshCw } from 'lucide-react';
//
const Collection = async ({
  params
}:{
  // collectionId = le nom du fichier s'il est différent, ça ne marche pas 
  params: { collectionId: string }
}) => {
  const connectedProfile = await currentUserInfos()
  // on selecte la collect selon params
  const theParams = await prismadb.collection.findFirst({
      where: { id: params.collectionId }
  })
  // on select tous les participant à cette collecte
  const participants = await prismadb.collection.findMany({
    where: {
      ownId: theParams?.ownId,
      amount: theParams?.amount,
      currency: "€",
      collectionType: theParams?.collectionType,
    }
  })
  // connected Participant collection datas
  const connectedParticipant = await prismadb.collection.findFirst({
    where: {
      ownId: theParams?.ownId,
      amount: theParams?.amount,
      currency: theParams?.currency,
      collectionType: theParams?.collectionType,
      usercodepin: connectedProfile?.usercodepin
    },
  })
  // on select tous les profiles 
  const profileDatas = await prismadb.profile.findMany()
  // on select tous les profiles
  const userDatas = await prismadb.user.findMany() 
  // #####
  const myRecipient = await prismadb.collectionResult.findFirst({
    where: {
      amount: theParams?.amount,
      collectionOwnId: theParams?.ownId,
      donatorEmail: connectedProfile?.googleEmail,
    }
  })
  // myRecipient profile
  const recipientProfile:any = await prismadb.profile.findFirst({
    where: { googleEmail: myRecipient?.recipientEmail }
  })
  // ceux qui ont déjà donné
  const hasGive = await prismadb.collectionResult.count({
    where: { 
      amount: theParams?.amount,
      collectionOwnId: theParams?.ownId,
     }
  })
  //
  return (
    <div className='h-full flex items-center justify-center flex-col pt-10 gap-5 bg-white'>
      <div className='w-4/5 lg:w-2/5 p-3 border rounded text-center bg-white shadow-md shadow-blue-100'>
        <p className='text-violet-800 text-center text-md lg:text-lg'>
          Participants à votre collecte Snippets n° {theParams?.ownId} de {theParams?.amount}{theParams?.currency}
        </p>
      </div>
      <div className='w-4/5'>
        {
          profileDatas && participants && (
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
              {
                participants.map((participant:any) => (
                  <Card key={participant.id} className='p-4 bg-white text-slate-600 shadow-lg shadow-blue-100'>
                    {
                      profileDatas.map((profileData) => (
                        <div key={profileData.id}>
                          {
                            participant.usercodepin == profileData.usercodepin && (
                              <div className='grid grid-cols-1 gap-y-2'>
                                <div className='grid grid-cols-1 gap-x-2'>
                                  <div className='flex flex-row items-center mb-2 gap-x-3'>
                                    {
                                      userDatas && (
                                        <div>
                                          {
                                            userDatas.map((userData) => (
                                              <div key={userData.id}>
                                                {
                                                  userData.email == profileData.googleEmail && (
                                                    <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                                                      <AvatarImage src={userData.image || ""} />
                                                      <AvatarFallback className="bg-slate-100">
                                                        <CircleUserRound className="text-violet-800 h-16 w-16 lg:h-24 lg:w-24" />
                                                      </AvatarFallback>
                                                    </Avatar>
                                                  )
                                                }
                                              </div>
                                            ))
                                          }
                                        </div>
                                      )
                                    }
                                    {/**/}
                                    <p className='text-md lg:text-xl font-semibold'> {capitalize(profileData.username)} </p>
                                  </div>
                                  <div className='flex flex-col items-start gap-y-1 pt-1'>
                                    <p className='text-xs text-slate-500 mb-1'> {capitalize(profileData.city)} </p>
                                    <p className='text-xs text-slate-500 mb-1'> {capitalize(profileData.bio)} </p>
                                    <div className='flex flex-row items-center'>
                                    <p className='text-xs text-slate-500'>Projet:&nbsp;</p> 
                                      {
                                        participant?.project ? (
                                          <div className='flex flex-row items-center text-xs'> 
                                          <span>&nbsp;{participant?.project} &nbsp; </span>
                                          {
                                            participant?.usercodepin === connectedParticipant?.usercodepin && (
                                              <>
                                              {
                                                hasGive < participant?.group && (
                                                  <Link href={`/dashboard/snippets/${params.collectionId}/project/${participant.id}`}>
                                                    <RefreshCw className='w-3 h-3 text-violet-800'/>
                                                  </Link>
                                                )
                                              }
                                              </>
                                            )
                                          }
                                          </div>
                                        ):(<p className='text-xs'>Non renseigné</p>)
                                      }
                                    </div>
                                  </div> 
                                </div>
                                <div className='flex items-end justify-end mt-4'>
                                  {
                                    profileData.usercodepin !== connectedProfile?.usercodepin ? (
                                      <div>
                                        {
                                          // est ce que le group est complet
                                          theParams?.group === theParams?.groupStatus ? (
                                          <>
                                            {
                                              // le participant ne veut être que donateur ?
                                              participant.isOnlyDonator === false ? (
                                                <>
                                                  {
                                                    connectedParticipant?.hasGive === false ? (
                                                      <Link href={`/dashboard/snippets/${params.collectionId}/${participant.id}`}>
                                                        <Button variant={"violet"} className='rounded-md text-white'>    
                                                          Donner <GrMoney className="h-5 w-5 cursor-pointer ml-2"/>
                                                        </Button>
                                                      </Link>
                                                    ):(
                                                        <Link href={"/dashboard/historique"}>
                                                          <Button variant={"outline"} size={"sm"} className='rounded-md'>
                                                            Merci de tout coeur &nbsp; 🙏🏼 
                                                          </Button> 
                                                        </Link>
                                                      )
                                                  }
                                                </>
                                              ):(
                                                  <p>Je veux juste donner</p>
                                                )
                                            }
                                          </>
                                          ):(
                                            <> 
                                              <p className='mt-6 text-md'>
                                                <span className='text-green-700'>{theParams?.groupStatus } {/*espape utile*/}</span>
                                                  participants / {theParams?.group}
                                              </p>
                                            </>
                                          )
                                        }
                                      </div>
                                    ):(
                                      <>
                                      {/* <JustGive/> */}
                                      <div className='text-sm'>
                                        { 
                                          connectedParticipant?.hasGive === true ? (
                                          <>
                                            <p className='pb-1'>Vous avez donné à &nbsp; <span className='font-medium text-violet-800'>{ recipientProfile?.username }</span></p>
                                            <p className=''> 
                                              <span className='text-green-600'>{hasGive}</span>
                                              &nbsp;/&nbsp;3 { hasGive < 2 ? (
                                              <span>à fait son choix</span>
                                              ):(<span>ont fait leur choix</span>)} 
                                            </p> 
                                          </> ):(
                                            <>
                                            {/* si le projet n'est pas renseigné == on affiche le cadeau */}
                                            {
                                              !connectedParticipant?.project && (
                                                <div className='bg-violet-800 text-white rounded-sm'>
                                                {
                                                  profileData?.usercodepin === connectedProfile?.usercodepin && (
                                                    <>
                                                    {
                                                      hasGive < participant?.group && (
                                                        <Link href={`/dashboard/snippets/${params.collectionId}/project/${participant.id}`}>
                                                          <Gift className='w-8 h-8'/>
                                                        </Link>
                                                      )
                                                    }
                                                    </>
                                                  )
                                                }
                                                </div>
                                              )
                                            }
                                            </>
                                          )
                                        }
                                      </div>
                                      </>
                                    )
                                  }
                                </div>
                              </div>
                            )
                          }
                        </div>
                      ))
                    }
                  </Card>
                ))
              }
            </div>
            )
          }
        </div>
      </div>
  )
}

export default Collection

//
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { GrMoney } from "react-icons/gr";
import Link from 'next/link';
import { capitalize, CurrentProfile, } from '@/hooks/own-current-user';
import { Ban, Building2, CircleUserRound, Gift, MessageSquareText } from 'lucide-react';
import { MyProjectForm } from '@/components/dashboard/action-in-collection/tripl/myproject-form';
import { JustToGive } from '@/components/dashboard/action-in-collection/tripl/just-donator';
import { AlsoReceiver } from '@/components/dashboard/action-in-collection/tripl/also-receiver';
//
const Collection = async ({ params }:{
  // collectionId = le nom du fichier s'il est différent, ça ne marche pas 
  params: { collectionId: string }
}) => {
  // le connecté
  const connected = await CurrentProfile()
  // on selecte la collecte selon l'id params et tous les participants
  const collectionParams = await prismadb.collection.findFirst({
    where: { id: params.collectionId },
    include: {
      collectionParticipants: {
        include: {
          profile: true
        }
      }
    }
  })
  // Les data de la collect du connecté
  const connectedCollectionData = await prismadb.collectionParticipant.findFirst({
    where: { 
      collectionId: params.collectionId,
      profileId: connected?.id
    }
  })
  // ##### celui a qui j'ai donné
  const myRecipient = await prismadb.collectionResult.findFirst({
    where: {
      amount: collectionParams?.amount,
      collectionId: params?.collectionId,
      donatorProfileId: connected?.id
    }
  })
  //myRecipient profile
  const recipientProfile:any = await prismadb.profile.findFirst({
    where: { id: myRecipient?.recipientProfileId }
  })
  // 
  const maxLength = 60 // max de caractères pour le projet
  // nombre de ceux qui ont déjà donné
  const hasGiveCount = await prismadb.collectionParticipant.count({
    where: { 
      collectionId: params.collectionId, // id de la collecte
      hasGive: true
     }
  })
  // le nombre de ceux qui ont décidé de ne pas recevoir
  const justGiveCount = await prismadb.collectionParticipant.count({
    where: { 
      collectionId: params?.collectionId, // id de la collecte
      isOnlyDonator: true
    }
  })
  // Combien ont déjà fait la désignation
  const designationCount = await prismadb.collectionParticipant.count({
    where: {
      collectionId: params?.collectionId,
      hasGive: true
    }
  })
  //
  return (
    <div className='h-full flex items-center justify-center flex-col pt-5 gap-5 bg-white'>
      <div className='w-4/5 lg:w-2/5 p-3 mb-5 border rounded text-center bg-white shadow-md shadow-blue-100'>
        <p className='text-slate-600 font-medium text-center text-lg lg:text-xl'>
          Participants à votre collecte {collectionParams?.collectionType} de {collectionParams?.amount}{collectionParams?.currency}
        </p>
        {
          designationCount !== 0 && designationCount !== 3 && (
            <p className='text-lg mt-5 font-medium text-green-600'>{designationCount} / 3 
            {designationCount === 1 ? (
              <span> &nbsp;a déjà fait sa désignation</span>
            ):(<span> &nbsp;ont déjà fait leur désignation</span>)} </p>
          )
        }
      </div>
      <div className='w-4/5'>
        {
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
            {
              collectionParams?.collectionParticipants?.map((participant:any) => (
                <>
                {
                  participant?.profile?.id === connected?.id && (
                    <Card key={participant.id} className='p-4 bg-white text-slate-600 shadow-lg shadow-blue-200'>
                      {/* ON AFFICHE EN PREMIER CELUI QUI EST CONNECTÉ */}
                      <div className='grid grid-cols-1 gap-y-2'>
                        <div className='grid grid-cols-1 gap-y-2'>
                          <div className='flex flex-row items-center mb-2 gap-x-3'>
                            <div>
                              <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                                <AvatarImage src={participant?.profile.googleImage || ""} />
                                  <AvatarFallback className="bg-slate-100">
                                    <CircleUserRound className="text-blue-500 h-16 w-16 lg:h-24 lg:w-24" />
                                  </AvatarFallback>
                              </Avatar>
                            </div>
                            <p className='text-lg lg:text-xl font-semibold'> {capitalize(participant?.profile?.username)} </p>
                          </div>
                        </div>
                        <div className='flex flex-col items-start gap-y-2 pt-1'>
                          <div className='flex flex-row items-baseline gap-x-2'>
                            <Building2 className='text-blue-500'/>
                            <p className='text-sm text-slate-500 mb-1'> {capitalize(participant?.profile.city)}</p>
                          </div>
                          <div className='flex flex-row gap-x-2'>
                            <MessageSquareText className='text-blue-500'/>
                            <p className='text-sm text-slate-500'> {capitalize(participant?.profile.bio)}</p>
                          </div>
                          <div className='w-full flex flex-row items-center gap-2'>
                            {
                              // si le group n'est pas encore plein, on peut modifier son projet 
                              collectionParams?.groupStatus < collectionParams?.group ? (
                                <MyProjectForm collectionId={params?.collectionId}/>
                              ):(
                                <Gift className='text-blue-500 h-7 w-7'/>
                              )
                            }
                            <div className='w-full'>
                              <p className='text-sm text-slate-500'>{capitalize(participant?.project.length > maxLength ? participant?.project.substring(0, maxLength) + '...' : participant?.project)}</p>
                            </div>
                          </div> 
                        </div> 
                      </div>

                      <div className='flex items-end justify-center mt-4'>
                      { 
                        participant?.hasGive === true ? (
                          <div className='flex flex-col items-center justify-center mt-1'>
                            <p className='pb-1'>Vous avez désignez &nbsp; <span className='font-medium'>{ recipientProfile?.username }</span></p>
                          </div> 
                        ):(
                            <>
                            {
                              // UN SEUL PARTICIPANT SU 3 PEU CHOISIR DE DEVENIR NON DÉSIGNABLE
                              participant?.isOnlyDonator === false && hasGiveCount < 1 && (justGiveCount < 1) ? (
                                <div className='flex items-end justify-center mt-5'>
                                  <JustToGive collectionId={params?.collectionId}/>
                                </div>
                              ):(
                                <>
                                  {
                                    participant?.isOnlyDonator === true && hasGiveCount < 1 && (justGiveCount < 1) && (
                                      <div className='flex items-end justify-center mt-5'>
                                        <AlsoReceiver collectionId={params?.collectionId}/>
                                      </div>
                                    )
                                  }
                                </>
                              )
                            } 
                            </>
                          )
                      }
                      </div>
                    </Card> )
                }
                </>
              ))
            }
            {/*  ON AFFICHE LES AUTRES PARTICIPANTS */}
            {
              collectionParams?.collectionParticipants?.map((participant:any) => (
                <>
                {
                  participant?.profile?.id !== connected?.id && (
                    <Card key={participant.id} className='p-4 bg-white text-slate-600 shadow-lg shadow-blue-200'>
                    {
                      <>
                      <div className='grid grid-cols-1 gap-y-2'>
                        <div className='grid grid-cols-1 gap-y-2'>
                          <div className='flex flex-row items-center mb-2 gap-x-3'>
                            <div>
                              <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                                <AvatarImage src={participant?.profile?.googleImage || ""} />
                                  <AvatarFallback className="bg-slate-100">
                                    <CircleUserRound className="text-blue-500 h-16 w-16 lg:h-24 lg:w-24" />
                                  </AvatarFallback>
                              </Avatar>
                            </div>
                            <p className='text-md lg:text-xl font-semibold'> {capitalize(participant?.profile?.username)} </p>
                          </div>
                        </div>
                        <div className='flex flex-col items-start gap-y-2 pt-1'>
                          <div className='flex flex-row items-baseline gap-x-2'>
                            <Building2 className='text-blue-500'/>
                            <p className='text-sm text-slate-500 mb-1'> {capitalize(participant?.profile.city)}</p>
                          </div>
                          <div className='flex flex-row gap-x-2'>
                            <MessageSquareText className=' text-blue-500'/>
                            <p className='text-sm text-slate-500'> {capitalize(participant?.profile.bio)}</p>
                          </div>
                          <div className='w-full flex flex-row gap-x-2'>
                            <Gift className='text-blue-500 w-7 h-7'/>
                            <p className='text-sm text-slate-500'>{capitalize(participant?.project.length > maxLength ? participant?.project.substring(0, maxLength) + '...' : participant?.project)}</p>
                          </div>
                        </div> 
                      </div>

                      <div className='flex items-end justify-center mt-4'>
                      {
                        // est ce que le group est complet
                        collectionParams?.group === collectionParams?.groupStatus && connectedCollectionData?.hasGive === false ? (
                          <>
                          {
                            // le participant ne veut être que donateur ?
                            participant.isOnlyDonator === true && (
                              <div className='flex items-end justify-center mt-5'>
                                <Button variant={"outline"} className='text-red-500 flex gap-x-4'>
                                  A choisi d&apos;être non désignable <Ban className='w-5 h-5'/>
                                </Button>
                              </div>
                            )
                          }
                          </>
                        ):(
                            <> 
                            {
                              hasGiveCount < 1 && (
                                <p className='mt-6 text-md'>
                                  <span className='text-green-700'>{collectionParams?.groupStatus} &nbsp;</span>
                                    participants / {collectionParams?.group}
                                </p>
                              )
                            }
                            </> 
                          )        
                      }
                      {
                          connectedCollectionData?.profileId === connected?.id && connectedCollectionData?.hasGive === true ? (
                            <Link href={"/dashboard/historique"}>
                              <Button variant={"outline"} size={"sm"} className='rounded-md'>
                                Merci pour votre don &nbsp; 🙏🏼 
                              </Button> 
                            </Link>
                          ):(
                            <>
                            {
                              collectionParams?.group === collectionParams?.groupStatus && participant && participant?.isOnlyDonator === false && (
                                <Link href={`/dashboard/tripl/${params.collectionId}/${participant.id}`}>
                                  <Button variant={"blue"} className='rounded-md text-white'>    
                                    Désigner <GrMoney className="h-5 w-5 cursor-pointer ml-2"/>
                                  </Button>
                                </Link>
                              )
                            }
                            </>
                          )
                      }
                      </div>
                      </>
                    }
                    </Card> )
                }
                </>
              ))
            }
          </div>
        }
        </div>
      </div>
  )
}
//
export default Collection

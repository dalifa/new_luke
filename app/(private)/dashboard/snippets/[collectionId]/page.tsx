//
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { GrMoney } from "react-icons/gr";
import Link from 'next/link';
import { capitalize, currentUserInfos } from '@/hooks/own-current-user';
import { Ban, CircleUserRound } from 'lucide-react';
import { JustToGiveInSnippets } from '@/components/dashboard/action-in-collection/snippets/just-donator';
import { AlsoReceiverInSnippets } from '@/components/dashboard/action-in-collection/snippets/also-receiver';
import { MySnippetsProjectForm } from '@/components/dashboard/action-in-collection/snippets/myproject-form';
// 
const Collection = async ({
  params
}:{
  // collectionId = le nom du fichier s'il est différent, ça ne marche pas 
  params: { collectionId: string }
}) => {
  const connectedProfile = await currentUserInfos()

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
  //
  const connectedCollectionData = await prismadb.collectionParticipant.findFirst({
    where: { 
      collectionId: params.collectionId,
      profileId: connectedProfile?.id
    }
  })
  // #####
  const myRecipient = await prismadb.collectionResult.findFirst({
    where: {
      amount: collectionParams?.amount,
      collectionId: params?.collectionId,    // todo
      donatorEmail: connectedProfile?.googleEmail,
    }
  })
  // myRecipient username
  const recipientFirstName:any = await prismadb.profile.findFirst({
    where: { googleEmail: myRecipient?.recipientEmail }
  })
  //
  const maxLength = 65 // max de caractères pour le projet
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
  //
  return (
    <div className='h-full flex items-center justify-center flex-col pt-5 gap-5 bg-white'>
      <div className='w-4/5 lg:w-2/5 p-3 mb-5 border rounded text-center bg-white shadow-md shadow-blue-100'>
        <p className='text-slate-600 text-center text-md lg:text-lg'>
          Participants à votre collecte {collectionParams?.collectionType} de {collectionParams?.amount}{collectionParams?.currency}
        </p>
      </div>
      <div className='w-4/5'>
        {
          <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4'>
            {
              collectionParams?.collectionParticipants?.map((participant:any) => (
                <>
                {
                  participant?.profile?.id === connectedProfile?.id && (
                    <Card key={participant.id} className='p-4 bg-white text-slate-600 shadow-lg shadow-blue-200'>
                      {/* ON AFFICHE EN PREMIER CELUI QUI EST CONNECTÉ */}
                      <div className='grid grid-cols-1 gap-y-2'>
                        <div className='grid grid-cols-1 gap-y-2'>
                          <div className='flex flex-row items-center mb-2 gap-x-3'>
                            <div>
                              <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                                <AvatarImage src={participant?.profile.image || ""} />
                                  <AvatarFallback className="bg-slate-100">
                                    <CircleUserRound className="text-violet-600 h-16 w-16 lg:h-24 lg:w-24" />
                                  </AvatarFallback>
                              </Avatar>
                            </div>
                            <p className='text-md lg:text-xl font-semibold'> {capitalize(participant?.profile?.username)} </p>
                          </div>
                        </div>
                        <div className='flex flex-col items-start gap-y-2 pt-1'>
                          <p className='text-xs text-slate-500 mb-1'> {capitalize(participant?.profile.city)} </p>
                          <p className='text-xs text-slate-500'> {capitalize(participant?.profile.bio)} </p>
                          {
                            participant?.project !== "Non renseigné" && (
                              <p className='text-xs'>{capitalize(participant?.project.length > maxLength ? participant?.project.substring(0, maxLength) + '...' : participant?.project)}</p>
                            )
                          }
                          <div className='flex flex-row items-center gap-x-6 py-1'>
                              <p className='text-xs'>
                                {
                                  participant?.project === "Non renseigné" ? (
                                    <span>Entrez le projet à faire financer</span>
                                  ):(
                                    <span>Modifiez le projet à faire financer</span>
                                  )
                                }
                              </p>
                              <p>
                                {
                                  hasGiveCount < collectionParams?.group && (
                                    <MySnippetsProjectForm collectionId={params?.collectionId}/>
                                  ) 
                                }
                              </p>
                          </div>
                        </div> 
                      </div>

                      <div className='flex items-end justify-center mt-4'>
                      { 
                        participant?.hasGive === true ? (
                          <div className='flex flex-col items-center justify-center mt-1'>
                            <p className='pb-1'>Vous avez désignez &nbsp; <span className='font-medium'>{ recipientFirstName?.username }</span></p>
                            <p className=''> 
                              <span className='text-green-600'>{hasGiveCount}</span>
                                &nbsp;/&nbsp;3 { hasGiveCount < 2 ? (
                                  <span>à fait son choix</span>
                                ):(<span>ont fait leur choix</span>)} 
                              </p> 
                            </div> 
                          ):(
                            <>
                            {
                              participant?.isOnlyDonator === false && hasGiveCount < 1 && (justGiveCount < (collectionParams?.group)) ? (
                                <div className='flex items-end justify-center mt-5'>
                                  <JustToGiveInSnippets collectionId={params?.collectionId}/>
                                </div>
                              ):(
                                <>
                                  {
                                    participant?.isOnlyDonator === true && hasGiveCount < 1 && (justGiveCount < (collectionParams?.group)) && (
                                      <div className='flex items-end justify-center mt-5'>
                                        <AlsoReceiverInSnippets collectionId={params?.collectionId}/>
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
                  participant?.profile?.id !== connectedProfile?.id && (
                    <Card key={participant.id} className='p-4 bg-white text-slate-600 shadow-lg shadow-blue-200'>
                    {
                      <>
                      <div className='grid grid-cols-1 gap-y-2'>
                        <div className='grid grid-cols-1 gap-y-2'>
                          <div className='flex flex-row items-center mb-2 gap-x-3'>
                            <div>
                              <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                                <AvatarImage src={participant?.profile.image || ""} />
                                  <AvatarFallback className="bg-slate-100">
                                    <CircleUserRound className="text-violet-600 h-16 w-16 lg:h-24 lg:w-24" />
                                  </AvatarFallback>
                              </Avatar>
                            </div>
                            <p className='text-md lg:text-xl font-semibold'> {capitalize(participant?.profile?.username)} </p>
                          </div>
                        </div>
                        <div className='flex flex-col items-start gap-y-2 pt-1'>
                          <p className='text-xs text-slate-500 mb-1'> {capitalize(participant?.profile.city)} </p>
                          <p className='text-xs text-slate-500'> {capitalize(participant?.profile.bio)} </p>
                          {
                            participant?.project !== "Non renseigné" && (
                              <p className='text-xs'>{capitalize(participant?.project.length > maxLength ? participant?.project.substring(0, maxLength) + '...' : participant?.project)}</p>
                            )
                          }
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
                                <Button variant={"outline"} className='text-violet-600 flex gap-x-4'>
                                  J'ai renoncé à recevoir <Ban className='w-5 h-5'/>
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
                          connectedCollectionData?.profileId === connectedProfile?.id && connectedCollectionData?.hasGive === true ? (
                            <Link href={"/dashboard/historique"}>
                              <Button variant={"outline"} size={"sm"} className='rounded-md'>
                                Merci de tout coeur &nbsp; 🙏🏼 
                              </Button> 
                            </Link>
                          ):(
                            <>
                            {
                              collectionParams?.group === collectionParams?.groupStatus && participant?.isOnlyDonator !== true && (
                                <Link href={`/dashboard/snippets/${params.collectionId}/${participant.id}`}>
                                  <Button variant={"violet"} className='rounded-md text-white'>    
                                    Donner <GrMoney className="h-5 w-5 cursor-pointer ml-2"/>
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
/*
  connectedCollectionData?.profileId === connectedProfile?.id && 
*/
export default Collection

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
  // Combien ont déjà fait la désignation
  const designationCount = await prismadb.collectionParticipant.count({
    where: {
      collectionId: params?.collectionId,
      hasGive: true
    }
  })
  //
  return (
    <div className='h-full flex items-center justify-center flex-col pt-5 gap-5 bg-white/90'>
      <div className='w-4/5 lg:w-2/5 p-3 mb-5 border rounded text-center bg-white shadow'>
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
                    <Card key={participant.id} className='p-4 bg-white text-slate-600 shadow-md shadow-gray-300'>
                      {/* ON AFFICHE EN PREMIER CELUI QUI EST CONNECTÉ */}
                      <div className='grid grid-cols-1 gap-y-2'>
                        <div className='grid grid-cols-1 gap-y-2'>
                          <div className='flex flex-row items-center mb-2 gap-x-3'>
                            <div>
                              <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                                <AvatarImage src={participant?.profile.googleImage || ""} />
                                  <AvatarFallback className="bg-slate-100">
                                    <CircleUserRound className="text-red-800 h-16 w-16 lg:h-24 lg:w-24" />
                                  </AvatarFallback>
                              </Avatar>
                            </div>
                            <p className='text-lg lg:text-xl font-semibold'> {capitalize(participant?.profile?.username)} </p>
                          </div> 
                        </div>
                        <div className='flex flex-col items-start gap-y-4 pt-4'>
                          <div className='flex flex-row items-baseline gap-x-2'>
                            <div>
                              <Building2 className='text-red-800'/>
                            </div>
                            <div>
                              <p className='text-sm text-slate-500 mb-1'> {capitalize(participant?.profile.city)}</p>
                            </div>
                          </div>
                          <div className='flex flex-row gap-x-2'>
                            <div>
                              <MessageSquareText className='text-red-800'/>
                            </div>
                            <div>
                              <p className='text-sm text-slate-500'>{capitalize(participant?.profile.bio.length > maxLength ? participant?.profile.bio.substring(0, maxLength) + '...' : participant?.profile.bio)}</p>
                            </div>
                          </div> 
                        </div> 
                      </div> 

                      <div className='flex items-end justify-center mt-4'>
                      { 
                        participant?.hasGive === true && (
                          <div className='flex flex-col items-center justify-center mt-1'>
                            <p className='pb-1'>Vous avez désignez &nbsp; <span className='font-medium'>{ recipientProfile?.username }</span></p>
                          </div> 
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
                    <Card key={participant.id} className='p-4 bg-white text-slate-600 shadow-md shadow-blue-100'>
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
                        <div className='flex flex-col items-start gap-y-4 pt-4'>
                          <div className='flex flex-row items-baseline gap-x-2'>
                            <div>
                              <Building2 className='text-red-800'/>
                            </div>
                            <div>
                              <p className='text-sm text-slate-500 mb-1'> {capitalize(participant?.profile.city)}</p>
                            </div>
                          </div>
                          <div className='flex flex-row gap-x-2'>
                            <div>
                              <MessageSquareText className=' text-red-800'/>
                            </div>
                            <div>
                              <p className='text-sm text-slate-500'>{capitalize(participant?.profile.bio.length > maxLength ? participant?.profile.bio.substring(0, maxLength) + '...' : participant?.profile.bio)}</p>
                            </div>
                          </div>
                        </div> 
                      </div> 

                      <div className='flex items-end justify-center mt-4'>
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
                              collectionParams?.group === collectionParams?.groupStatus && participant && (
                                <Link href={`/dashboard/tripl/${params.collectionId}/${participant.id}`}>
                                  <Button variant={"primary"} className='rounded-md text-white'>    
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



import { donorValidationAction } from '@/actions/snippets/donorTransferValidation_Action'
import ChooseRecipientButton from '@/components/dashboard/snippets/chosenRecipientButton'
import DonorValidation from '@/components/dashboard/snippets/donor_Validation'
import LeaveCollectionButton from '@/components/dashboard/snippets/leaveCollectionButton'
import RecipientValidation from '@/components/dashboard/snippets/recipient_Validation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { capitalize, CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import { decrypt } from '@/lib/utils'
import { format } from "date-fns"
import { ArrowUp01, BadgeDollarSign, Building2, CheckSquare, FilePen, HandCoins, MapPin, Phone, Send, UserRound } from 'lucide-react'
// 
const DATE_FORMAT = "d MMM yyyy, HH:mm" 

const MyRecipients = async ({params}:{params: {collectionId: string}}) => {
  const connected:any = await CurrentProfile()
  // LA COLLECTE CONCERNÉE
  const concernedCollection = await prismadb.collection.findFirst({
    where: {
      id: params?.collectionId
    }
  })
  // TOUS LES PARTICIPANTS À LA COLLECTE
  const participants = await prismadb.collectionParticipant.findMany({
    where: { 
      collectionId: params?.collectionId,
      onStandBy: false
    },
    include: { 
      participant: true,
      recipient: true
    }
  })
  // LE CONNECTÉ COMME PARTICIPANT
  const connectedAsParticipant = await prismadb.collectionParticipant.findFirst({
    where: {
      collectionId: params?.collectionId,
      participantId: connected?.id
    }
  })
  //
  // LE CONNECTÉ COMME RECIPIENT
  const connectedAsRecipient = await prismadb.collectionParticipant.findFirst({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id
    }
  })
  //
  // le nbr de fois que son donor a validé et pas lui
  const isReceipientValidationCount = await prismadb.collectionParticipant.count({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id,
      donorValidation: true,
      recipientValidation: false
    }
  })
  // SI LE CONNECTÉ A ETE CHOISI PAR TOUS LES PARTICIPANTS
  const result1AsRecipient = await prismadb.collectionResult.findFirst({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id
    }
  })
  // si le connecté à choisi son destinataire
  const result2AsDonor = await prismadb.collectionResult.findFirst({
    where: {
      collectionId: params?.collectionId,
      donorId: connected?.id
    }
  })
  // nombre de fois que le connecté à validé en tant que recipient (Number Of Validation As Recipient)
  const novar = await prismadb.collectionParticipant.count({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id,
      recipientValidation: true
    }
  })
  // 
  async function handleConfirm() {
    "use server";
    if (!connectedAsParticipant?.recipientId) return;
    await donorValidationAction(connectedAsParticipant?.recipientId, params.collectionId);
  }
  //
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <div className='w-full flex flex-col items-center justify-center my-10'>
        <div className='w-4/5 flex flex-col lg:mt-5 py-4 items-center justify-center border-4 rounded-xl border-indigo-300'>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Personnes à bénir
          </h2>
        </div>
      </div>
      <div className="w-4/5 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        { participants && participants.map((donor:any) => (
        <Card key={donor?.id} className="bg-white shadow-xl text-center p-4">
          <div className="flex flex-col items-center gap-4 mb-4">
            <Avatar className="h-20 w-20">
              {donor?.participant?.googleImage && (
                <AvatarImage src={donor?.participant?.googleImage}/> )}
                <AvatarFallback className="bg-indigo-600 text-white">
                  {donor?.participant?.firstname[0]}
                </AvatarFallback>
            </Avatar>
            { donor?.participant && (
            <p className="text-lg font-semibold text-indigo-600">
              {capitalize(donor?.participant?.username)}
            </p>)}
            <Separator/> 
            {
              // affiché seulement si le participantId est destinataire d'un autre
              connectedAsParticipant?.recipientId && connectedAsParticipant.recipientId === donor?.participantId && (
                <div className='w-full flex flex-row gap-4 mt-2'>
                  <div className='basis-1/3'>
                    <UserRound className='text-indigo-600'/>
                  </div>
                  <div className='basis-2/3 text-end'>
                    { donor?.participant && (
                      <p className="text-lg font-semibold text-indigo-600 break-all">
                        {capitalize(donor?.participant?.firstname)}
                      </p>
                    )}
                  </div>
                </div>
              )
            }
            <div className='w-full flex flex-row gap-4 mt-2'>
              <div className='basis-1/3'>
                <Building2 className='text-indigo-600'/>
              </div>  
              <div className='basis-2/3 text-end'>
                { donor?.participant && (
                  <p className="text-slate-600">
                    {capitalize(donor?.participant?.city)}
                  </p>
                )}
              </div>
            </div>
            <div className='w-full flex flex-row gap-4 mt-2'>
              <div className='basis-1/3'>
                <MapPin className="text-indigo-600"/>
              </div>
              <div className='basis-2/3 text-end'>
                { donor?.participant && (
                  <p className="text-slate-600">
                    {capitalize(donor?.participant?.country)}
                  </p>
                )}
              </div>
            </div>
            {
              connectedAsParticipant?.recipientId && connectedAsParticipant.recipientId === donor?.participantId && (
                <div className='w-full flex flex-row gap-4 mt-2'>
                  <div className='basis-1/3'>
                    <Phone className="text-indigo-600"/>
                  </div>
                  <div className='basis-2/3 text-end'>
                    { donor?.participant && (
                      <p className="text-slate-600">
                        {decrypt(donor?.participant?.encryptedPhone)}
                      </p>
                    )}
                  </div>
                </div>
              )
            }
            <div className='w-full flex flex-row gap-4 mt-2'>
              <div className='basis-1/3'>
                <HandCoins className="text-indigo-600"/>
              </div>
              <div className='basis-2/3 text-end'>
                <p className="text-xl font-bold text-green-600">
                  {donor?.concernedAmount} {connected?.currency}
                </p>
              </div>
            </div>
            <div className='w-full flex flex-col gap-4 mt-2'>
              <div className='flex flex-col space-y-3'>
                <FilePen className="text-indigo-600"/>
                <p className="text-lg text-slate-700">
                  {donor?.participant?.bio}
                </p>
              </div>
            </div>
            { connected && connected?.id === donor?.participantId && donor?.isRecipientChosen === true && (
              <div className='w-full flex flex-row gap-4 mt-2'>
                <div className='basis-1/3'>
                  <ArrowUp01 className="text-indigo-600"/>
                </div>
                <div className='basis-2/3 text-end'>
                  <p className="text-slate-700">
                    <strong>{donor?.donationNumber}</strong>
                  </p>
                </div>
              </div>
              )
            }
            {
              connected?.id === donor?.participantId && connectedAsRecipient?.recipientValidation === true && (
                <div className='w-full flex flex-row gap-4 mt-2'>
                <div className='basis-1/3'>
                  <CheckSquare className="text-indigo-600"/>
                </div>
                <div className='basis-2/3 text-end'>
                  <p className="text-slate-700">
                    <strong>{novar}</strong> {novar > 1 ? (<span className='text-green-600'>dons confirmés reçus</span>):(<span className='text-green-600'>don confirmé reçu</span>)}
                  </p>
                </div>
              </div>
              )
            }
            <Separator className="my-4"/>  
            {/* Si le groupe n'est pas complet on affiche le boutton sortir */} 
            {
              connected && connected?.id === donor?.participantId && concernedCollection?.isGroupComplete === false && (
                <LeaveCollectionButton 
                collectionId={params.collectionId}
                participantId={connected.id}/>
              )
            }
            <div>
              { donor?.donorValidation && (donor?.recipientId === connected?.id || connected?.id === donor?.participantId ) && (<p>Validé le:</p>)}
              { donor?.donorValidationAt && (donor?.recipientId === connected?.id || connected?.id === donor?.participantId ) && (<p>{format(new Date(donor?.donorValidationAt), DATE_FORMAT)}</p>)}
            </div>
            {donor?.donorValidation && (donor?.recipientId === connected?.id || connected?.id === donor?.participantId ) && (
              <div className='w-full flex flex-row gap-4 mt-2'>
                <div className='basis-1/3'>
                  <BadgeDollarSign className='text-indigo-600'/>
                </div>
                <div className='basis-2/3 text-end'>
                  <p>TRANSFERT <span className='text-green-600'>OK</span></p>
                </div>  
              </div>
            )}
            {donor?.donorValidation && (donor?.recipientId === connected?.id || connected?.id === donor?.participantId ) && (
              <div className='w-full flex flex-row gap-4 mt-2'>
                <div className='basis-1/3'>
                  <Send className='text-indigo-600'/>
                </div>
                <div className='basis-2/3 text-end'>
                  <p>SMS &nbsp;<span className='text-green-600'>OK</span></p>
                </div>
              </div>
            )}
            {/* le connecté est le participantId, il a choisi le destinataire, et n'a pas encore validé le transfert == on affiche */}
            { connected && donor?.donorValidation === false 
            && connected?.id === donor?.participantId 
            && donor?.isRecipientChosen === true && (
              <DonorValidation onConfirm={handleConfirm}/>
            )} 
            {/* 
            CAS OÙ LE CONNECTÉ EST CHOISI ET N'A PAS ENCORE CHOISI
            */}
            {
              concernedCollection?.isGroupComplete === true  // si le groupe est complet
              && connected?.id && connected?.id !== donor?.participantId // le connecté n'es pas le participant affiché
              && connectedAsParticipant?.isRecipientChosen === false // le connecté n'a pas encore choisi de recipient
              && (!connectedAsRecipient || connectedAsRecipient && connectedAsRecipient?.participantId !== donor?.participantId)  // le connecté a été choisi et celui qui l'a choisi n'est pas le participant affiché
              && (
                <ChooseRecipientButton collectionId={params?.collectionId} participantId={connected?.id} recipientId={donor?.participant?.id}/>
              )
            }
            {/* 
            CAS OÙ LE CONNECTÉ EST CHOISI PAR TOUS LES AUTRES PARTICIPANT ET N'A PAS ENCORE CHOISI
            */}
            {
              concernedCollection?.isGroupComplete === true  // si le groupe est complet
              && connected?.id && connected?.id !== donor?.participantId // le connecté n'es pas le participant affiché
              && connectedAsParticipant?.isRecipientChosen === false // le connecté n'a pas encore choisi de recipient
              && result1AsRecipient?.donationReceived === concernedCollection?.group - 1  // le connecté a été choisi par 99% des participants
              && (
                <ChooseRecipientButton collectionId={params?.collectionId} participantId={connected?.id} recipientId={donor?.participant?.id}/>
              )
            }
            {/* n'apparait que sur le profil du recipient connecté */}
            {
              connected?.id === donor?.recipientId && (
                <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  Votre Donateur
                </button>
              )
            }
            {/* TODO: - ou si le connecté a été choisi par tous les participant */}
            {/* si le connecté est le donor, on affiche ceci sur le profil de son destinataire s'il n'a pas encore validé le transfert */}
            
            {/* n'apparait que sur le profil du participant donor connecté */}
            {donor?.donorValidation && connected?.id === donor?.participantId && (
              <div className='mt-5'>
                <p>Votre donataire ne devrait pas tarder à valider de son côté la reception de votre don.</p>
                <p className='mt-5 text-indigo-600'>Merci pour votre générosité 🙏🏼</p>
              </div> 
            )}

            {/* ################ S'AFFICHE SUR LE PROFIL DU RECIPIENT ############### */}
            {
              connectedAsParticipant?.isRecipientChosen === true && connectedAsParticipant?.recipientId === donor?.participantId && donor?.recipientValidation === false && (
                <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  Votre Destinataire
                </button>
              )
            }
            {
              connectedAsParticipant?.recipientId === donor?.participantId && connectedAsParticipant?.recipientValidation === true && (
                <button className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  Votre destinataire a confirmé avoir reçu le don
                </button>
              )
            }
            {/* n'apparait que sur le profil du connecté s'il est recipientId */}
            {
              result1AsRecipient && connected?.id === donor?.participantId && connectedAsRecipient?.recipientValidation === false && (
                <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  Vous avez été choisi {result1AsRecipient?.donationReceived > 1 && (<span>({result1AsRecipient?.donationReceived})</span>)}
                </button>
              )
            }
            {/* n'apparait que sur le profil du recipient connecté */}
            { isReceipientValidationCount > 0 && connected?.id === donor?.participantId && (
                <RecipientValidation 
                collectionId={params.collectionId} 
                recipientId={connected.id}
                //donorId={donor?.recipient?.id ?? ""}  
              />
              )
            }
          </div>
        </Card>
        ))}
      </div>
    </div>
  )
}
//
export default MyRecipients

/*

*/
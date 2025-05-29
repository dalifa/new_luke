

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
import { ArrowUp01, BadgeDollarSign, Building2, FilePen, HandCoins, MapPin, Phone, Send, UserRound } from 'lucide-react'
// 
const DATE_FORMAT = "d MMM yyyy, HH:mm" 

const MyRecipients = async ({params}:{params: {collectionId: string}}) => {
  const connected = await CurrentProfile()
  // TOUS LES PARTICIPANT À LA COLLECTE
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
  // LE RECIPIENT QU'IL A CHOISI
  const recipientChosen = await prismadb.collectionParticipant.findFirst({
    where: {
      collectionId: params?.collectionId,
      participantId: connected?.id
    }
  })
  // SI LE GROUP EST COMPLET
  const verif = await prismadb.collection.findFirst({
    where: {
      id: params?.collectionId
    }
  })
  // le nbre de fois qu'il est recipient
  const isReceipientCount = await prismadb.collectionParticipant.count({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id
    }
  })
  // le select tout les donation number s'il a été choisi > 1 
  const dNumbers = await prismadb.collectionParticipant.findMany({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id
    }
  })
  // le nbr de fois que son donor a validé et pas lui
  const isReceipientValidationCount = await prismadb.collectionParticipant.count({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id,
      donorValidation: true,
      recipientValidation: false
    }
  })
  // SI LE CONNECTÉ A ETE CHOISI PAR DE TOUS LES PARTICIPANTS
  const result1 = await prismadb.collectionResult.findFirst({
    where: {
      collectionId: params?.collectionId,
      recipientId: connected?.id
    }
  })
  // 
  async function handleConfirm() {
    "use server";
    if (!recipientChosen?.recipientId) return;
    await donorValidationAction(recipientChosen?.recipientId, params.collectionId);
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
              // affiché seulement si destinataire
              recipientChosen?.recipientId && recipientChosen.recipientId === donor?.participantId && (
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
              recipientChosen?.recipientId && recipientChosen.recipientId === donor?.participantId && (
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
            {
              connected?.id === donor?.participant?.id && donor?.isRecipientChosen === true && donor?.recipientValidation === false && (
                <div className='w-full grid grid-cols-1'>
                  {
                    dNumbers.map((nbr) =>(
                      <div key={nbr?.id} className='w-full flex flex-row gap-4 mt-2'>
                        <div className='basis-1/3'>
                          <ArrowUp01 className="text-indigo-600"/>
                        </div>
                        <div className='basis-2/3 text-end'>
                          <p className="text-slate-700">
                            <strong>{donor?.donationNumber}</strong>
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) 
            }
            <Separator className="my-4"/>  
            {/* Si le groupe n'est pas complet on affiche le boutton sortir */} 
            {
              connected && connected?.id === donor?.participantId && verif?.isGroupComplete === false && (
                <LeaveCollectionButton 
                collectionId={params.collectionId}
                participantId={connected.id} />
              )
            }
            <div>
              { donor?.donorValidation && (<p>Validé le:</p>)}
              { donor?.donorValidationAt && (<p>{format(new Date(donor?.donorValidationAt), DATE_FORMAT)}</p>)}
            </div>
            {donor?.donatorValidation && (
              <div className='w-full flex flex-row gap-4 mt-2'>
                <div className='basis-1/3'>
                  <BadgeDollarSign className='text-indigo-600'/>
                </div>
                <div className='basis-2/3 text-end'>
                  <p>TRANSFERT <span className='text-green-600'>OK</span></p>
                </div>  
              </div>
            )}
            {donor?.donatorValidation && (
              <div className='w-full flex flex-row gap-4 mt-2'>
                <div className='basis-1/3'>
                  <Send className='text-indigo-600'/>
                </div>
                <div className='basis-2/3 text-end'>
                  <p>SMS:{donor?.donationNumber} &nbsp;<span className='text-green-600'>OK</span></p>
                </div>
              </div>
            )}
            {/* le donateur confirme avoir donné */}
            { connected && donor?.donatorValidation === false && connected?.id === donor?.participantId && donor?.isRecipientChosen === true ? (
              <DonorValidation onConfirm={handleConfirm}/>
            ):(
              <>
              {
                // la session exist
                connected && 
                // le group est complet
                verif?.isGroupComplete === true &&
                // le connecté n'a pas encore choisi
                recipientChosen?.isRecipientChosen === false && 
                // le connecté n'est pas le participant concerné
                connected?.id !== donor?.participantId || 
                (
                  connected && 
                  // le group est complet
                  verif?.isGroupComplete === true &&
                  // le connecté n'a pas encore choisi
                  recipientChosen?.isRecipientChosen === false && 
                  // le connecté n'est pas le participant concerné
                  connected?.id !== donor?.participantId &&
                  // le connecté à reçu de tous ou le connecté n'est pas recipient participant concerné
                  //result1?.donationReceived === verif?.group - 1 || connected?.id !== donor?.recipientId) && (
                  result1?.donationReceived === verif?.group - 1 ) && (
                    <ChooseRecipientButton
                      collectionId={params.collectionId}
                      participantId={connected.id}
                      recipientId={donor?.participant?.id}
                    />
                )}
              </>
            )} 
            {/* n'apparait que sur le profil du participant donor connecté */}
            {
              recipientChosen?.recipientId && recipientChosen.recipientId === donor?.participantId && (
                <button className="w-full mt-4 bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  Destinataire choisi
                </button>
              )
            }
            {/* n'apparait que sur le profil du recipient connecté */}
            {
              connected?.id === donor?.recipientId && (
                <button className="w-full mt-4 bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  Votre donateur
                </button>
              )
            }
            {/* n'apparait que sur le profil du recipient connecté */}
            {
              isReceipientCount > 0 && connected?.id === donor?.participantId && (
                <button className="w-full mt-4 bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  Vous avez été choisi {isReceipientCount > 1 && (<span>({isReceipientCount})</span>)}
                </button>
              )
            }
            {/* n'apparait que sur le profil du recipient connecté */}
            { isReceipientValidationCount > 0 && connected?.id === donor?.participantId && (
                <RecipientValidation/> 
              )
            }
            {/* n'apparait que sur le profil du participant donor connecté */}
            {donor?.donorValidation && connected?.id === donor?.participantId && (
              <div className='mt-5'>
                <p>Votre donataire ne devrait pas tarder à valider de son côté la reception de votre don.</p>
                <p className='mt-5 text-indigo-600'>Merci pour votre générosité 🙏🏼</p>
              </div> 
            )}
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
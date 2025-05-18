
import { donorValidationAction } from '@/actions/snippets/donorValidation_Action'
import { recipientChoiceAction } from '@/actions/snippets/recipient_choice_Action'
import ChooseRecipientButton from '@/components/dashboard/snippets/chosenRecipientButton'
//import { recipientChoiceAction } from '@/actions/snippets/recipient_choice_Action'
import DonorValidation from '@/components/dashboard/snippets/donor_Validation'
import RecipientChoice from '@/components/dashboard/snippets/recipient_choice'
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
  // POUR CHOISIR SON DESTINATAIRE
  
  // POUR CONFIRMER AVOIR FAIT LE TRANSFERT WERO
  async function handleConfirm() {
    "use server";
    //
    if (!recipientChosen?.recipientId) return; // Vérification avant d’appeler l’Action Serveur
    await donorValidationAction(recipientChosen?.recipientId);
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
            {
              // à vérifier si le prénom du recipient apparait
              connected?.id === donor?.participantId && donor?.isRecipientChosen === true && donor?.participant?.id === donor?.recipientId && (
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
              connected?.id === donor?.participantId && donor?.participant?.id === donor?.recipientId && (
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
              connected?.id === donor?.participant?.id && donor?.isRecipientChosen === true && (
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
            <Separator className="my-4" />   
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

            {!donor?.donatorValidation && connected?.id === donor?.participantId && donor?.isRecipientChosen === true ? (
              <DonorValidation onConfirm={handleConfirm}/> 
            ):(
              <>
              {
                connected && verif?.isGroupComplete === true && 
                connected?.id !== donor?.participantId &&
                  recipientChosen?.isRecipientChosen === false && (
                    <ChooseRecipientButton
                      collectionId={params.collectionId}
                      participantId={connected.id}
                      recipientId={donor?.participant?.id}
                    />
                 )}
              </>
            )}
            {donor?.donatorValidation && (
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
async function handleChoice() {
    "use server";
    //
    if (recipientChosen?.recipientId) return; // Vérification avant d’appeler l’Action Serveur
    await recipientChoiceAction();
  }
*/
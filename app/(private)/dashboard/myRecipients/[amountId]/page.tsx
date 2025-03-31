import { donorBlessingValidation } from '@/actions/toBless/donorValidation'
import DonorBlessValidation from '@/components/dashboard/toBlessSomeone/donorBlessValidation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { capitalize, CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import { decrypt } from '@/lib/utils'
import { ArrowUp01, Building2, CheckSquare, HandCoins, MapPin, Phone, UserRound } from 'lucide-react'
import React from 'react'

const MyRecipients = async ({params}:{params: {amountId: string}}) => {
  const connected = await CurrentProfile()
  //
  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params?.amountId }
  })
  //
  const recipientChosen = await prismadb.myListToBless.findFirst({
    where: { 
      amountId: concernedAmount?.id,
      donorId: connected?.id,
      recipientValidation: false
    },
    include: {
      recipient: true
    }
  })
  //
  //
  async function handleConfirm() {
    "use server";
    //
    if (!recipientChosen?.id) return; // Vérification avant d’appeler l’Action Serveur
    await donorBlessingValidation(recipientChosen.id);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="bg-white shadow-md p-6 w-4/5 md:w-1/2 lg:w-1/3 text-center">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Détails du bénéficiaire
        </h2>
        <hr className="mb-4" />

        <div className="flex flex-col items-center gap-3 mb-2">
          <Avatar className="h-20 w-20">
            {recipientChosen?.recipient?.googleImage ? (
              <AvatarImage src={recipientChosen?.recipient?.googleImage} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white">
                {recipientChosen?.recipient?.firstname[0]}
              </AvatarFallback>
            )}
          </Avatar>
          { recipientChosen?.recipient && (
          <p className="text-lg font-semibold text-blue-500">
            {capitalize(recipientChosen?.recipient?.username)}
          </p>)}
          
          <div className='w-full grid grid-cols-2 gap-4 mt-2'>
            <UserRound className='text-blue-500'/>
            { recipientChosen?.recipient && (
            <p className="text-lg font-semibold text-blue-500">
              {capitalize(recipientChosen?.recipient?.firstname)}
            </p>)}
          </div>
          <div className='w-full grid grid-cols-2 gap-4 mt-2'>
            <Building2 className='text-blue-500'/>
            { recipientChosen?.recipient && (<p className="text-gray-600">
              {capitalize(recipientChosen?.recipient?.city)}
              </p>)}
          </div>
          <div className='w-full grid grid-cols-2 gap-4 mt-2'>
            <MapPin className='text-blue-500'/>
            { recipientChosen?.recipient && (<p className="text-gray-600">
              {capitalize(recipientChosen?.recipient?.country)}
              </p>)}
          </div>
          <div className='w-full grid grid-cols-2 gap-4 mt-2'>
            <Phone className='text-blue-500'/>
            { recipientChosen?.recipient && (<p className="text-gray-600">
              {decrypt(recipientChosen?.recipient?.encryptedPhone)}
              </p>)}
          </div>
          <div className='w-full grid grid-cols-2 gap-4 mt-2'>
            <HandCoins className='text-blue-500'/>
            <p className="text-xl font-bold text-green-600">
              {concernedAmount?.amount} {concernedAmount?.currency}
            </p>
          </div>
          <div className='w-full grid grid-cols-2 gap-4 mt-2'>
            <ArrowUp01 className='text-blue-500'/>
            <p className="text-gray-700"><strong>{recipientChosen?.donationNumber}</strong></p>
          </div>

          <Separator className="my-4" />

          {!recipientChosen?.donatorValidation && (
          <div className='w-full grid grid-cols-2 gap-4'>
            <CheckSquare className='text-blue-500'/>
            <p>WERO <span className='text-green-600'>OK</span></p>
          </div>
          )}

          {recipientChosen?.donatorValidation && (
            <DonorBlessValidation onConfirm={handleConfirm} />
          )}

          <div className='mt-5'>
            <p>Votre bénéficière ne va pas tarder à valider de son côté la reception de votre don.</p>
            <p className='mt-5 text-blue-500'>Merci pour votre générosité 🙏🏼</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MyRecipients
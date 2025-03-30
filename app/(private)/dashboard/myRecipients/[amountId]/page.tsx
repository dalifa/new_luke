import { ConfirmTheBlessing } from '@/actions/toBless/commitToBlessing'
import { donorBlessingValidation } from '@/actions/toBless/donorValidation'
import DonorBlessValidation from '@/components/dashboard/toBlessSomeone/donorBlessValidation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import { UserRound } from 'lucide-react'
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

        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20">
            {recipientChosen?.recipient?.googleImage ? (
              <AvatarImage src={recipientChosen?.recipient?.googleImage} />
            ) : (
              <AvatarFallback className="bg-blue-500 text-white">
                {recipientChosen?.recipient?.firstname[0]}
              </AvatarFallback>
            )}
          </Avatar>

          <p className="text-lg font-semibold text-blue-500">
            {recipientChosen?.recipient?.firstname}
          </p>

          <p className="text-gray-600">
            📍 {recipientChosen?.recipient?.city}, {recipientChosen?.recipient?.country}
          </p>

          <p className="text-gray-600">📞 {recipientChosen?.recipient?.encryptedPhone || "Non disponible"}</p>

          <p className="text-xl font-bold text-green-600">
            Montant : {concernedAmount?.amount} {concernedAmount?.currency}
          </p>

          <p className="text-gray-700">🎟️ Numéro unique : <strong>{recipientChosen?.donationNumber}</strong></p>

          {!recipientChosen?.donatorValidation && (
            <DonorBlessValidation onConfirm={handleConfirm} />
          )}
        </div>
      </Card>
    </div>
  )
}

export default MyRecipients
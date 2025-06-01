"use server"

import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
import { revalidatePath } from "next/cache"
import { number } from "zod"

export async function recipientValidationAction({
  collectionId,
  recipientId,
  donationNumber,
}: {
  collectionId: string
  recipientId: string
  donationNumber: number
}) {
  if (!donationNumber) {
    return { success: false, error: "Le numéro de don est requis" }
  }

  try {
    const connected = await CurrentProfile()
    const exist = await prismadb.collectionParticipant.findFirst({
      where: {
        collectionId,
        recipientId: connected?.id,
        donationNumber,
      }
    }) 
    // Mettre recipientValidation à true
    if(connected?.id === recipientId && exist)
    {
      await prismadb.collectionParticipant.updateMany({
        where: {
          collectionId,
          recipientId,
          participantId: exist?.participantId, // le donor est le participant
        },
        data: {
          recipientValidation: true,
          recipientValidationAt: new Date(),
        },
      })

      // Insérer dans AlreadyMet
      await prismadb.alreadyMet.create({
        data: {
          profileId: exist?.participantId,
          profileMetId: recipientId 
        },
      })
    

      revalidatePath(`/dashboard/snippets/myCollections/${collectionId}`)

      return { success: true }
    }
  } catch (error) {
    console.error("Erreur recipientValidationAction", error)
    return { success: false, error: "Une erreur est survenue" }
  }
}

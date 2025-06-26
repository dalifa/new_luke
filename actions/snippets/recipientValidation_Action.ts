"use server"

import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
import { revalidatePath } from "next/cache"


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
    //
    const exist = await prismadb.collectionParticipant.findFirst({
      where: {
        collectionId,
        recipientId: connected?.id, // il est recipient
        donationNumber,
        recipientValidation:false // très important
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
      // on vérifie si tous ont donnés ou pas
      const concerneCollection = await prismadb.collection.findFirst({
        where: { id: collectionId }
      })
      // on compte combien il y a de recipientValidation faite
      const validationNumber = await prismadb.collectionParticipant.count({
        where: { 
          collectionId,
          recipientValidation: true
        }
      })
      // si tous ont validé, on closed la collecte
      if(validationNumber === concerneCollection?.group)
      {
        await prismadb.collection.updateMany({
          where: {id: collectionId},
          data: {
            isCollectionClosed: true
          }
        })
      }
      // On update le total reçu ou donné par le recipient et le donor
      const donorProfile = await prismadb.profile.findFirst({
        where: {
          id: exist?.participantId
        }
      })
      // LE DONOR A DONNÉ EN PLUS
      if(donorProfile)
      {
        await prismadb.profile.updateMany({
          where: { id: exist?.participantId },
          data: {
            given: donorProfile?.given + exist?.concernedAmount
          }
        })
      }
      // LE RECIPIENT A REÇU EN PLUS
      await prismadb.profile.updateMany({
        where: { id: connected?.id },
        data: { received: connected?.received + exist?.concernedAmount }
      })
    

      revalidatePath(`/dashboard/snippets/myCollections/${collectionId}`)

      return { success: true }
    }
  } catch (error) {
    console.error("Erreur recipientValidationAction", error)
    return { success: false, error: "Une erreur est survenue" }
  }
}

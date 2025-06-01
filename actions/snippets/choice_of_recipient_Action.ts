'use server'

import { prismadb } from '@/lib/prismadb'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function recipientChoiceAction({
  collectionId,
  participantId,
  recipientId,
}: {
  collectionId: string,
  participantId: string,
  recipientId: string
}) {
  try {
    //
    const nbr = await prismadb.profile.count()
    //
    await prismadb.collectionParticipant.updateMany({
      where: {
        collectionId,
        participantId,
      },
      data: {
        // donationNumber à refaire en mieux  
        donationNumber: 1000 + nbr,
        recipientId,
        isRecipientChosen: true,
        recipientChosenOn: new Date()
      }
    })
    // ENTRER LE DONOR ET LE RECIPIENT DANS RESULT POUR SAVOIR QUI À CHOISI QUI
    await prismadb.collectionResult.create({
      data:{
        collectionId,
        donorId: participantId,
        recipientId,
      }
    })
    // on vérifie si le recipient a déjà été choisi dans cette collecte
    const recipientCount = await prismadb.collectionResult.count({
      where: {
        collectionId,
        recipientId
      }
    }) 
    //
    const recipientResult = await prismadb.collectionResult.findFirst({
      where: {
        collectionId,
        recipientId
      }
    }) 
    //
    if(recipientCount > 0 && recipientResult)
    {
      await prismadb.collectionResult.updateMany({
        where: {
          collectionId,
          recipientId
        },
        data: {
          donationReceived: recipientResult?.donationReceived + 1
        }
      })
    }
    //
    revalidatePath(`/dashboard/snippets/myCollections/${collectionId}`);
    redirect(`/dashboard/snippets/myCollections/${collectionId}`);
    return { success: true }
  } catch (error) {
    console.error('Erreur choix du recipient', error)
    return { success: false, error }
  }
}


/* 
*/
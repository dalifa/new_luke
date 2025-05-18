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
    await prismadb.collectionParticipant.updateMany({
      where: {
        collectionId,
        participantId,
      },
      data: {
        recipientId,
        isRecipientChosen: true,
        recipientChosenOn: new Date()
      }
    })
    revalidatePath(`/dashboard/snippets/myCollections/${collectionId}`);
    redirect(`/dashboard/snippets/myCollections/${collectionId}`);
    return { success: true }
  } catch (error) {
    console.error('Erreur choix du recipient', error)
    return { success: false, error }
  }
}


/* "use server";
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
//
export async function recipientChoiceAction(collectionId: string) {
  const connected = await CurrentProfile()
  if (!collectionId) return;
  // on select le amountId concerné
  const concerned = await prismadb.collectionParticipant.findFirst({
    where: {
      collectionId
    }
  })
  //
  if(connected?.id)
  {
    await prismadb.collectionParticipant.updateMany({
      where: { 
        collectionId,
        participantId: connected?.id,
        isRecipientChosen: true
      },
      data: {
        donorValidation: true,
        donorValidationAt: new Date(), // Date et heure actuelles
      },
    });
  }
  //
  revalidatePath(`/dashboard/snippets/myCollections/${concerned?.collectionId}`);
  redirect(`/dashboard/snippets/myCollections/${concerned?.collectionId}`);
}
*/
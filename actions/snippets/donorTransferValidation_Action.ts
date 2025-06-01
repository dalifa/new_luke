// actions/snippets/donorValidation_Action.ts
'use server'; 

import { CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';
import { connected } from 'process';

export async function donorValidationAction(recipientId: string, collectionId: string) {
  try {
    const connected = await CurrentProfile()
    //
    await prismadb.collectionParticipant.updateMany({
      where: {
        participantId: connected?.id,
        recipientId,
        collectionId,
      },
      data: {
        donorValidation: true,
        donorValidationAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/recipients/${collectionId}`);
  } catch (error) {
    console.error("Erreur lors de la validation du don:", error);
    throw new Error("La confirmation a échoué.");
  }
}


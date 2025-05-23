// actions/snippets/donorValidation_Action.ts
'use server';

import { prismadb } from '@/lib/prismadb';
import { revalidatePath } from 'next/cache';

export async function donorValidationAction(recipientId: string, collectionId: string) {
  try {
    await prismadb.collectionParticipant.updateMany({
      where: {
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


"use server";

import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import { randomUUID } from "crypto"; // Pour générer un numéro de donation unique

export async function wishDonationConfirm(amountId: string) {
  // Récupérer l'utilisateur connecté
  const connected = await CurrentProfile();
  if (!connected) return;

  // Vérifier le montant et la devise
  const amountConcerned = await prismadb.amount.findFirst({
    where: { 
      id: amountId,
      currency: connected.currency
    }
  });
  if (!amountConcerned) return;

  // Nombre max d'affichages
  const maxMetric = await prismadb.metric.findFirst({
    select: { maxDisplays: true },
  });
  const maxDisplays = maxMetric?.maxDisplays ?? 1;

  // Récupérer les bénéficiaires potentiels
  const potentialRecipients = await prismadb.canBeBlessed.findMany({
    where: {
      canBeDisplayed: true,
      amountId,
      profileId: { not: connected.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected.id } } },
            { metByProfiles: { some: { profileId: connected.id } } },
          ],
        },
      },
    },
    take: maxDisplays,
  });

  if (potentialRecipients.length === 0) return;

  // Créer une entrée dans MyListToBless
  const myListToBless = await prismadb.myListToBless.create({
    data: {
      donorId: connected.id,
      amountId, //
    },
  });

  // Ajouter les bénéficiaires potentiels dans MyPotentialRecipient
  for (const recipient of potentialRecipients) {
    await prismadb.myPotentialRecipient.create({
      data: {
        listToBlessId: myListToBless.id,
        potentialRecipientId: recipient.profileId,
        amount: amountConcerned?.amount // à afficher dans le dialog
      },
    });

    // Mettre à jour nbrOfDisplays et canBeDisplayed dans CanBeBlessed
    await prismadb.canBeBlessed.update({
      where: { id: recipient.id },
      data: {
        nbrOfDisplays: { increment: 1 },
        canBeDisplayed: recipient.nbrOfDisplays + 1 >= recipient.maxDisplays ? false : true,
      },
    });
  }

  // Rediriger vers la page des bénéficiaires potentiels
  redirect(`/dashboard/potentialRecipients/${amountId}`);
}



// CEUX QUE JE VAIS AFFICHER DANS /dashboard/potentialRecipients/${amountId}
export const getPotentialRecipients = async (amountId: string) => {
  // Récupérer l'utilisateur connecté
  const connected = await CurrentProfile();
  if (!connected) return [];

  // Récupérer la liste de bénédictions (MyListToBless) pour cet utilisateur et ce montant
  const listsToBless = await prismadb.myListToBless.findMany({
    where: {
      donorId: connected.id,
      amountId, // LE MONTANT CONCERNÉ
      recipientValidation: false
    },
    include: {
      potentialRecipients: {
        include: {
          recipient: true, // Récupère les infos du bénéficiaire
        },
      },
    },
  });
  return listsToBless
};



/*

*/
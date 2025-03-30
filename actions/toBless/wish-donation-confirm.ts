"use server";

import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
//
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
  // compter le nombre de list to bless existante
  const listCount = await prismadb.myListToBless.count()
  const newOwnId = listCount + 1

  // Créer une entrée dans MyListToBless
  const myListToBless = await prismadb.myListToBless.create({
    data: {
      ownId: newOwnId, // 
      donorId: connected.id,
      amountId, //
      amount: amountConcerned?.amount
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
      where: { 
        id: recipient.id,
        amountId
       },
      data: {
        nbrOfDisplays: { increment: 1 },
        canBeDisplayed: recipient.nbrOfDisplays + 1 >= recipient.maxDisplays ? false : true,
      },
    });
  }

  // Rediriger vers la page des bénéficiaires potentiels
  //redirect(`/dashboard/potentialRecipients/${amountId}`);
  redirect(`/dashboard/listToBless/${amountId}`);
}


/*

*/
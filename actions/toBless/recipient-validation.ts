"use server";

import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import { redirect } from "next/navigation";
// LE CONNECTÉ À REÇU LE DONATION NUMBER ET ICI VALIDE AVOIR REÇU LE DON PAR WERO
export async function recipientValidation(donationNumber: string, recipientId: string) {
  const connected = await CurrentProfile();
  if (!connected) return { error: "Utilisateur non authentifié" };
  // ON SELECT LE MAXDISPAYS EN COUR
  const maxD = await prismadb.metric.findFirst()
  //
  if( connected?.id === recipientId)
  {
    // Vérifier que le donation number existe
    const donation = await prismadb.myListToBless.findFirst({
      where: {
        donationNumber: Number(donationNumber),
        chosenRecipient: recipientId,
        recipientValidation: false,
      },
      include: {
        donor: true,
      },
    });

    if (!donation) return { error: "Aucune transaction trouvée pour ce numéro" };

    // Mettre à jour recipientValidation à true
    await prismadb.myListToBless.update({
      where: { id: donation.id },
      data: { 
        recipientValidation: true,
        recipientConfirmedAt: new Date(), // Date
      },
    });
    // augmenté le montant total donné du donator
    const donatorGiven = await prismadb.profile.findFirst({
      where: { id: donation?.donor?.id }, 
    })
    if(donatorGiven)
    {
      await prismadb.profile.updateMany({
        where: { id: donation?.donor?.id },
        data: { given: donatorGiven?.given + donation?.amount }
      })
    }
    // augmenter le montant total reçu du connecté
    await prismadb.profile.updateMany({
      where: { id: connected?.id },
      data: {
        received: connected?.received + donation?.amount
      }
    })

    // Vérifier si celui qui à donné au connecté est déjà dans canBeBlessed
    const donorExistingInCanBeBlessed = await prismadb.canBeBlessed.findFirst({
      where: {
        profileId: donation?.donor?.id,
        amountId: donation?.amountId,
      },
    });

    if (donorExistingInCanBeBlessed) {
      // Mettre à jour les informations du donateur dans canBeBlessed
      await prismadb.canBeBlessed.update({
        where: { id: donorExistingInCanBeBlessed.id },
        data: {
          canBeDisplayed: true,
          maxDisplays: maxD?.maxDisplays,
        },
      });
    } else {
      // Ajouter le donor du connecté comme nouveau potentiel recipient du montant concerné
      await prismadb.canBeBlessed.create({
        data: {
          profileId: donation?.donor?.id,
          amountId: donation?.amountId,
          currency: donation?.donor?.currency,
          canBeDisplayed: true,
          maxDisplays: maxD?.maxDisplays,
        },
      });
    }
    //
    //return { success: true }; 
    //
    redirect("/dashboard/historique")
  }
}

/*
*/
"use server"
import { CurrentProfile } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
//
export async function ConfirmMyBlessing(amountId: string, recipientId: string): Promise<string | void> {
  const connected = await CurrentProfile();
  if (!connected) throw new Error("Utilisateur non authentifié");

  console.log("Server Action appelée avec:", { amountId, recipientId });
  // on vérifie si le connecté a une bless list de ce montant qui n'est pas cloturée (recipient n'est pas encore choisi)
  const existingList = await prismadb.myListToBless.findFirst({
    where: {
      donorId: connected.id,
      amountId,
      recipientValidation: false,
      isRecipientChosen: false, // Vérifie si le recipient a été choisi
    },
  });

  if (!existingList) {
    console.log("Aucune liste trouvée pour ce montant.");
    return;
  }

  const listCount = await prismadb.myListToBless.count();
  const donationNumber = listCount + 2000;
  // on vérifie si le recipient est dans la list concernée
  const verif = await prismadb.myPotentialRecipient.count({
    where: {
      listToBlessId: existingList?.id,
      potentialRecipientId: recipientId,
      isRecipientChosen: false
    },
  });
  // si le connecté a ce recipient dans sa list
  if (verif === 1) {
    // CHOIX DU RECIPIENT
    await prismadb.myListToBless.update({
      where: { id: existingList.id },
      data: {
        chosenRecipient: recipientId,
        donationNumber,
        isRecipientChosen: true,
        recipientChosenAt: new Date()
      },
    });

    await prismadb.myPotentialRecipient.updateMany({
      where: { listToBlessId: existingList?.id },
      data: { isRecipientChosen: true },
    });
    // ON MET LE DONOR ET LE RECIPIENT DANS ALREADYMET
    await prismadb.alreadyMet.create({
      data: {
        profileId: connected?.id,
        profileMetId: recipientId
      }
    })

    console.log("Mise à jour réussie. Redirection en cours...");
    return `/dashboard/myRecipients/${amountId}`;
  }

  console.log("La vérification a échoué.");
  return;
}

/*
*/

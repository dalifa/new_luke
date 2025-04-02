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
  console.log("🔍 Vérification dans la base de données avec : ", {
    donorId: connected.id,
    amountId,
    recipientValidation: false,
    isRecipientChosen: false,
  });

  if (!existingList) {
    console.log("Aucune liste trouvée pour ce montant.");
    return;
  }

  const listCount = await prismadb.myListToBless.count();
  const donationNumber = listCount + 1000;
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
    //
    await prismadb.myListToBless.update({
      where: { id: existingList.id },
      data: {
        chosenRecipient: recipientId,
        donationNumber,
        isRecipientChosen: true
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




/* "use server";

import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";

// ⚡ Server Action pour bénir un bénéficiaire
export async function ConfirmMyBlessing(amountId: string, recipientId: string) {
  const connected = await CurrentProfile();
  if (!connected) throw new Error("Utilisateur non authentifié");

  // Vérifier que l'utilisateur a bien une liste existante avec ce montant
  const existingList = await prismadb.myListToBless.findFirst({
    where: {
      donorId: connected.id,
      amountId,
      recipientValidation: false,
      chosenRecipient: null, // La liste ne doit pas encore avoir de bénéficiaire
    },
  });

  if (!existingList) return;

    // créer le donation number
    const listCount = await prismadb.myListToBless.count()
    const donationNumber = listCount + 1000 

  // on vérifie si le recipient est canBeBlessed du connecté
  const verif = await prismadb.myPotentialRecipient.count({
    where: {
      listToBlessId: existingList?.id,
      potentialRecipientId: recipientId
    }
  })
  
  if(verif === 1)
  { 
    // Mettre à jour la liste avec le bénéficiaire choisi
    await prismadb.myListToBless.update({
      where: { id: existingList.id },
      data: {
        chosenRecipient: recipientId,
        donationNumber,
      },
    });
    // signaler que le recipient à été choisi
    await prismadb.myPotentialRecipient.updateMany({
      where: { listToBlessId: existingList?.id },
      data: { listStatus: true}
    })
  }
  console.log("ok ça marche")

  // Rediriger vers la page du bénéficiaire choisi où on voie ses vrai infos
  redirect(`/dashboard/myRecipients/${amountId}`); 
}
*/

"use server";

import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";

// ⚡ Server Action pour bénir un bénéficiaire
export async function ConfirmTheBlessing(amountId: string, recipientId: string) {
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

  // Rediriger vers la page du bénéficiaire choisi
  redirect(`/dashboard/myRecipients/${amountId}`); 
}


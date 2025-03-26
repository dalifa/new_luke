"use server";

import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";

// Fonction pour générer un numéro unique à 6 chiffres
function generateDonationNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Nombre entre 100000 et 999999
}

// ⚡ Server Action pour bénir un bénéficiaire
export async function blessRecipient(formData: FormData) {
  const connected = await CurrentProfile();
  if (!connected) return;

  const recipientId = formData.get("recipientId") as string;
  const amountId = formData.get("amountId") as string;

  if (!recipientId || !amountId) return;

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

  // Générer un numéro unique pour le don
  const donationNumber = generateDonationNumber();

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
  }
  // Rediriger vers la page du bénéficiaire choisi
  redirect(`/dashboard/recipientDetail/${existingList.id}`);
}


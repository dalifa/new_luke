"use server";

import { prismadb } from "@/lib/prismadb";

export async function getRecipientDetail(listId: string) {
  const list = await prismadb.myListToBless.findUnique({
    where: { id: listId },
    include: {
      recipient: true, // Récupère les infos du bénéficiaire
    },
  });

  if (!list || !list.recipient) return null;

  return {
    firstname: list.recipient.firstname,
    city: list.recipient.city,
    country: list.recipient.country,
    hashedPhone: list.recipient.hashedPhone, // ⚠️ Sécurité : afficher un format masqué si nécessaire
    donationNumber: list.donationNumber,
  };
}

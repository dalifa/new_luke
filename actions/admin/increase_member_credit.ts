

"use server";

import { CurrentProfile } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const increaseMemberCredit = async (memberManagedId: string, formData: FormData) => {
  const amountToAdd = Number(formData.get("amount"));

  // Vérification des valeurs invalides 
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    throw new Error("Montant invalide !");
  }

  const connected = await CurrentProfile();
  if (!connected) {
    throw new Error("Utilisateur non connecté !");
  }

  const concerned = await prismadb.profile.findUnique({
    where: { id: memberManagedId },
  });

  // Vérifier si le profil concerné existe et a un crédit défini
  if (!concerned || concerned.credit === null) {
    throw new Error("Utilisateur introuvable ou crédit invalide !");
  }

  // Vérification du rôle ADMIN
  if (connected.role !== "ADMIN") {
    throw new Error("Accès refusé !");
  }
  // Calcul du nouveau crédit
  const newCredit = Number(concerned.credit + amountToAdd)

  // Mise à jour du crédit
  await prismadb.profile.update({
    where: { id: concerned.id },
    data: { credit: newCredit },
  });

  // Enregistrement de l'activité
  await prismadb.activity.create({
    data: {
      author: connected.firstname,
      activity: `L'ADMIN ${connected.firstname} (codepin: ${connected.codepin}) a augmenté le crédit de ${concerned.firstname} (codepin: ${concerned.codepin}) de ${amountToAdd}, crédit total: ${newCredit}.`,
    },
  });
 
  // Revalidation du cache pour actualiser les données
  revalidatePath(`/dashboard/admin/${concerned.id}`);
};


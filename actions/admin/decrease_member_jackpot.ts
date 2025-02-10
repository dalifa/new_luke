"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// 
export const decreaseMemberJackpot = async (memberManagedId: string, formData:any) => {
  const amountToRemove = Number(formData.get("amount"));
  const connected = await CurrentProfile();
  if (!connected) {
    return redirect ("/")
  }
  // Vérification du rôle ADMIN
  if (connected.role !== "ADMIN") {
    return redirect("/dashboard")
  }
  const concerned = await prismadb.profile.findUnique({
    where: { id: memberManagedId },
  });
  // Vérifier si le profil concerné existe et a un crédit défini
  if (!concerned || concerned.credit === null) {
    throw new Error("Utilisateur introuvable ou crédit invalide !");
  }
  // Vérification des valeurs invalides 
  if (isNaN(amountToRemove) || amountToRemove <= 0) {
    return redirect(`/dashboard/admin/${concerned.id}`)
  }

  // Calcul du nouveau crédit
  const newJackpot = concerned.jackpot - amountToRemove;

  // Mise à jour du jackpot
  await prismadb.profile.update({
    where: { id: concerned.id },
    data: { jackpot: newJackpot },
  });

  // Enregistrement de l'activité
  await prismadb.activity.create({
    data: {
      author: connected.firstname,
      activity: `L'ADMIN ${connected.firstname} (codepin: ${connected.codepin}) a diminué la cagnotte de ${concerned.firstname} (codepin: ${concerned.codepin}) de ${amountToRemove}, nouvelle cagnotte total: ${newJackpot}.`,
    },
  });

  // Revalidation du cache pour actualiser les données
  revalidatePath(`/dashboard/admin/${concerned.id}`);
};
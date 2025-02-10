"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// 
export const decreasePartnerCredit = async (memberManagedId: string, formData:any) => {
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

  // Calcul du nouveau crédit partner
  const newPartnerCredit = concerned.partnerCredit - amountToRemove;
  // Mise à jour du partner crédit
  await prismadb.profile.update({
    where: { id: concerned.id },
    data: { partnerCredit: newPartnerCredit },
  });

  // Enregistrement de l'activité
  await prismadb.activity.create({
    data: {
      author: connected.firstname,
      activity: `L'ADMIN ${connected.firstname} (codepin: ${connected.codepin}) a diminué le partner crédit de ${concerned.firstname} (codepin: ${concerned.codepin}) de ${amountToRemove}, nouveau partner crédit total: ${newPartnerCredit}.`,
    },
  });

  // Revalidation du cache pour actualiser les données
  revalidatePath(`/dashboard/admin/${concerned.id}`);
};
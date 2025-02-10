"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// 
export const decreasePartnerMaxCredit = async (memberManagedId: string, formData:any) => {
  const amountToRemove = formData.get("amount");
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

  // Calcul du nouveau max crédit partner
  const newMaxPartnerCredit = concerned.maxPartnerCredit - amountToRemove;
  // Mise à jour du max partner crédit
  await prismadb.profile.update({
    where: { id: concerned.id },
    data: { maxPartnerCredit: newMaxPartnerCredit },
  });

  // Enregistrement de l'activité
  await prismadb.activity.create({
    data: {
      author: connected.firstname,
      activity: `L'ADMIN ${connected.firstname} (codepin: ${connected.codepin}) a diminué le max partner crédit de ${concerned.firstname} (codepin: ${concerned.codepin}) de ${amountToRemove}, nouveau partner crédit total: ${newMaxPartnerCredit}.`,
    },
  });

  // Revalidation du cache pour actualiser les données
  revalidatePath(`/dashboard/admin/${concerned.id}`);
};
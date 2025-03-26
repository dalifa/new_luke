"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { redirect } from "next/navigation";
// 
export const levelToRecovery = async (profileId: string, formData:any) => {
  const chosenLevel = Number(formData.get("amount"));
  const connected = await CurrentProfile();
  if (!connected) {
    return redirect ("/")
  }
  // Vérification des valeurs invalides 
  if (isNaN(chosenLevel) ||  chosenLevel <= 0) {
    return redirect(`/dashboard/${profileId}`)
  }
  // Mise à jour du crédit
    await prismadb.profile.updateMany({
      where: { id: connected?.id },
      data: { recoveryLevel: chosenLevel },
    });
   
    // Enregistrement de l'activité
    await prismadb.activity.create({
      data: {
        author: connected.firstname,
        activity: `${connected.firstname} (codepin: ${connected.codepin}) a choisi le seuil de ${chosenLevel}${connected?.currency} pour déclancher le transfert de sa cagnotte.`,
      },
    });  

    // Revalidation du cache pour actualiser les données
    redirect ("/dashboard");

};
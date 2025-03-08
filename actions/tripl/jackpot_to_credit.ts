"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// 
export const jackpotToCredit = async (profileId: string, formData:any) => {
  const amountToTransfer = Number(formData.get("amount"));
  const connected = await CurrentProfile();
  if (!connected) {
    return redirect ("/")
  }
  // Vérifier si son jackpot 
  if (connected?.credit === null) {
    throw new Error("Utilisateur introuvable ou crédit invalide !");
  }
  // Vérification des valeurs invalides 
  if (isNaN(amountToTransfer) ||  amountToTransfer <= 0) {
    return redirect(`/dashboard/${connected?.id}`)
  }
  const concernedCredit = Number(connected?.credit) // son jackpot en INT
  const concernedJackpot = Number(connected?.jackpot) // son crédit en INT
  // Calcul du nouveau jackpot
  if(concernedJackpot >= amountToTransfer)
  {  
    const newJackpot = concernedJackpot - amountToTransfer;

    const newCredit = concernedCredit + amountToTransfer

    // Mise à jour du crédit
    await prismadb.profile.updateMany({
      where: { id: connected?.id },
      data: { 
        credit: newCredit,
        jackpot: newJackpot
      },
    });
   
    // Enregistrement de l'activité
    await prismadb.activity.create({
      data: {
        author: connected.firstname,
        activity: `${connected.firstname} (codepin: ${connected.codepin}) a transféré ${amountToTransfer} de son jackpot vers son crédit: nouveau jackpot: ${newJackpot} .nouveau crédit: ${newCredit}.`,
      },
    });  

    // Revalidation du cache pour actualiser les données
    redirect ("/dashboard");
  }else{
    
      throw new Error("Votre cagnotte est inférieur à la somme entrée !");
    
  }

};
"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// 
export const increasePartnerMaxCredit = async (memberManagedId: string, formData:any) => {
  const amountToAdd = formData.get("amount");
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
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    return redirect(`/dashboard/admin/${concerned.id}`)
  }
  // 
  // ON AUGMENT SON MAX PARTNER CREDIT DE AMOUNT
    const newMaxPartnerCredit = concerned?.maxPartnerCredit + amountToAdd
    //
    await prismadb.profile.updateMany({
      where: { id: concerned?.id },
      data: { maxPartnerCredit: newMaxPartnerCredit }
    })
    //
    // ACTIVITY
    await prismadb.activity.create({
      data: {
        author: connected?.firstname,
        activity: "dont le codepin est " + connected?.codepin + " vient d'augmenter le max partner crédit de " + concerned?.firstname + " codepin: " + concerned?.codepin + " de " + amountToAdd + " ce qui fait " + newMaxPartnerCredit +   "."
      }
    })
    //
    revalidatePath(`/dashboard/admin/${concerned?.id}`)
};
"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// 
export const activeInactiveAccount = async (memberManagedId: string) => {
  const connected = await CurrentProfile()
  //
  const concerned = await prismadb.profile.findFirst({
    where: {id: memberManagedId}
  })
  // Vérifier si le profil concerné existe
  if (!concerned) {
    throw new Error("Utilisateur introuvable !");
  }

  // Vérification du rôle ADMIN
  if (connected && connected.role !== "ADMIN") {
    redirect("/dashboard")
  }
  // ON ACTIVE LE COMPTE DU MEMBRE
    if(concerned?.isActiveAccount === false)
    {  
      await prismadb.profile.updateMany({
        where: { id: concerned?.id },
        data: { isActiveAccount: true }
      })
      // ACTIVITY
      await prismadb.activity.create({
        data: {
          author: connected?.firstname,
          activity: "dont le codepin est " + connected?.codepin + " vient d'activer le compte de " + concerned?.firstname + " codepin: " + concerned?.codepin + "."
        }
      })
      //
      revalidatePath(`/dashboard/admin/${concerned?.id}`)
      //
    }else{
      // ON DESACTIVE DECOMPTE
      await prismadb.profile.updateMany({
        where: { id: concerned?.id },
        data: { isActiveAccount: false }
      })
      // ACTIVITY
      await prismadb.activity.create({
        data: {
          author: connected?.firstname,
          activity: "dont le codepin est " + connected?.codepin + " vient de désactiver le compte de " + concerned?.firstname + " codepin: " + concerned?.codepin + "."
        }
      })
      //
      revalidatePath(`/dashboard/admin/${concerned?.id}`)
  } 
};
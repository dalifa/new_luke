"use server";
import { currentUser } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//  
export const updateChurch = async (profileId: string, formData:any) => {
  //const newCity = formData.get("city");  avant
  const newChurch = formData.get("value");
  const session = await currentUser()
  // l'abonné concerné  
  const concerned = await prismadb.profile.findFirst({
    where: { 
      id: profileId,
      googleEmail: session?.email
     } 
  })
  // update de la ville du membre
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { church: newChurch }
  })
  //
  /* // ACTIVITY
  await prismadb.activity.create({
    data: {
      author: concerned?.firstname,
      activity: "dont le codepin est " + concerned?.codepin + "vient de updater son sa ville."
    }
  }) */
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  //
};
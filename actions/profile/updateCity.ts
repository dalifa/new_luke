"use server";
import { currentUser } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//  
export const updateCity = async (profileId: string, formData:any) => {
  const newCity = formData.get("city");
  const session = await currentUser()
  // l'abonné concerné  
  const concerned = await prismadb.profile.findFirst({
    where: { 
      id: profileId,
      googleImage: session?.email
     } 
  })
  // update de la ville du membre
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { city: newCity }
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
  revalidatePath(`/dashboard/${profileId}`)
  //
};
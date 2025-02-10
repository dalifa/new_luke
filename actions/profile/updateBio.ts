"use server";
//
import { auth } from "@/auth";
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//  
export const updateBio = async (profileId: string, formData:any) => {
  const newBio = formData.get("bio");
  //
  const session = await auth()
  const userSession = await prismadb.user.findFirst({
    where: { email: session?.user?.email }
  })
  //
  const connected = await CurrentProfile()
  //
  if(connected?.id === profileId)
  {
    // update de la présentation du membre
    await prismadb.profile.updateMany({
      where: { id: profileId },
      data: { 
        bio: newBio,
        googleImage: userSession?.image
      }
    })
    //
  // ACTIVITY
  await prismadb.activity.create({
    data: {
      author: connected?.firstname,
      activity: "dont le codepin est " + connected?.codepin + "vient de updater sa présentation."
    }
  })
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  }
  //
};
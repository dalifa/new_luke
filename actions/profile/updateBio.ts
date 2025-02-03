"use server";
import { auth } from "@/auth";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
// 
export const updateBio = async (profileId: string, formData:any) => {
  const newBio = formData.get("bio");
  //
  const session = await auth()
  //
  const useSession = await prismadb.user.findFirst({
    where: { email: session?.user?.email }
  })
  // l'abonné concerné  
  const concerned = await prismadb.profile.findFirst({
    where: { 
      id: profileId,
      hashedEmail: useSession?.hashedEmail
    } 
  })
  // update de la présentation du membre
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { 
      bio: newBio,
      googleImage: useSession?.image
    }
  })
  //
  // ACTIVITY
  await prismadb.activity.create({
    data: {
      author: concerned?.firstname,
      activity: "dont le codepin est " + concerned?.codepin + "vient de updater sa présentation."
    }
  })
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  //
};
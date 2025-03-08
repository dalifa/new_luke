"use server";
import { auth } from "@/auth";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//
export const updateUsername = async (profileId: string, formData:any) => {
  const memberUsername = formData.get("value");
  const session = await auth()
  //  
  const userSession = await prismadb.user.findFirst({
    where: { email: session?.user?.email }
  })
  // l'abonné concerné  
  const concerned = await prismadb.profile.findFirst({
    where: { 
      id: profileId,
      googleEmail: userSession?.email
    } 
  })
  //
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { 
      username: memberUsername,
      googleImage: userSession?.image
    }
  })
  //
  // ACTIVITY
  await prismadb.activity.create({
    data: {
      author: concerned?.firstname,
      activity: "dont le codepin est " + concerned?.codepin + " vient de updater son pseudo qui est maintenant." + memberUsername + "."
    }
  })
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  //
};
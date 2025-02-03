"use server";
import { auth } from "@/auth";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//
export const updateUsername = async (profileId: string, formData:any) => {
  const memberUsername = formData.get("username");
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
  //
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { username: memberUsername }
  })
  //
  // ACTIVITY
  await prismadb.activity.create({
    data: {
      author: concerned?.firstname,
      activity: "dont le codepin est " + concerned?.codepin + " vient de updater son pseudo."
    }
  })
  //
  console.log("ok username")
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  //
};
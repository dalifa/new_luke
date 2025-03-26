"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//
export const updateFirstname = async (profileId: string, formData:any) => {
  const memberFirstname = formData.get("firstname");
  const session = await auth()
  //  
  const userSession = await prismadb.user.findFirst({
    where: { email: session?.user?.email }
  })
  // l'abonné concerné  
  const concerned = await prismadb.profile.findFirst({
    where: { 
      id: profileId,
      hashedEmail: userSession?.hashedEmail
    } 
  })
  //
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { 
      firstname: memberFirstname,
      googleImage: userSession?.image
    }
  })
  //
  // ACTIVITY
  await prismadb.activity.create({
    data: {
      author: concerned?.firstname,
      activity: "dont le codepin est " + concerned?.codepin + " vient de updaté son prénom."
    }
  })
  // 
  console.log('ça marche coté server')
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  //
};
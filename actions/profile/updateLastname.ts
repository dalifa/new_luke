"use server";
import { auth } from "@/auth";
//
import { prismadb } from "@/lib/prismadb";
import { encrypt } from "@/lib/utils";
import { revalidatePath } from "next/cache";
//
export const updateLastname = async (profileId: string, formData:any) => {
  const memberLastname = formData.get("value");
  const session = await auth()
  // 
  const useSession = await prismadb.user.findFirst({
    where: { email: session?.user?.email }
  })
  // l'abonné concerné  
  const concerned = await prismadb.profile.findFirst({
    where: { 
      id: profileId,
      googleEmail: useSession?.email
    } 
  })
  //
  const lastnameCrypted = encrypt(memberLastname)
  //
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { lastname: lastnameCrypted } // cryptage du nom en cas de pyratage
  })
  //
  // TODO: ACTIVITY
  await prismadb.activity.create({
    data: {
      author: concerned?.firstname,
      activity: " dont le codepin est " + concerned?.codepin + " vient de updaté son nom."
    }
  })
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  //
};
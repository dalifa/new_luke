"use server";
import { auth } from "@/auth";
//
import { prismadb } from "@/lib/prismadb";
import { encrypt } from "@/lib/utils";
import { revalidatePath } from "next/cache";
//
export const updatePhone = async (profileId: string, formData:any) => {
  const newPhone = formData.get("phone"); 
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
  // on crypte le phone
  const phoneCrypted = encrypt(newPhone)
  //
  await prismadb.profile.updateMany({
    where: { id: concerned?.id },
    data: { encryptedPhone:phoneCrypted }
  })
  //
  // ACTIVITY
  await prismadb.activity.create({
    data: {
      author: concerned?.firstname,
      activity: "dont le codepin est " + concerned?.codepin + " vient de updater son phone."
    }
  })
  //
  revalidatePath(`/dashboard/profile/${profileId}`)
  //
};
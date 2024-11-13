"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//
export const updateProfileForTest = async (collectionId: string, formData: FormData ) => {
  // l'username entré
  const chosenUsercodepin = formData.get('profileConcerned') as string
  // avant
  const last = await prismadb.currentProfileForTest.findFirst()
  // les datas du profile choisi
  const profiledata = await prismadb.profile.findFirst({
    where: { username: chosenUsercodepin }
  })
  // on update
  await prismadb.currentProfileForTest.updateMany({
    data: { 
      profileTestId: profiledata?.id,
      usercodepin: profiledata?.usercodepin,
      lastProfile: last?.usercodepin 
    }
  });
  //  
    revalidatePath('/dashboard/admin')
  //
};
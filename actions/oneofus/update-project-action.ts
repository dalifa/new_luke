"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateProject = async (collectionId: string, formData: FormData ) => {
  // const connected = await currentUserInfos() // => en prod
  // ##4 test##
  const connectedtestor = await prismadb.currentProfileForTest.findFirst()
  // ##4 test##
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: connectedtestor?.usercodepin}
  })
  // ### FIN 4 TEST ####
  const project = formData.get('project') as string
  const concernedCollection = await prismadb.collection.findFirst({
    where: { id: collectionId }
  })
  //
  await prismadb.collectionParticipant.updateMany({
    where: {
      collectionId: concernedCollection?.id,
      profileId: connected?.id,
    },
    data: { project }
  });
  //
  if(concernedCollection?.collectionType === "oneofus")
    {
      revalidatePath(`/dashboard/oneofus/${collectionId}`)
      redirect(`/dashboard/oneofus/${collectionId}`)
    }
  //
};
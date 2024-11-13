"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//
export const updateProject = async (collectionId: string, formData: FormData ) => {
  // les datas de profil du connecté
  const connected = await currentUserInfos()
  // le project qu'il entre dans le formulaire
  const project = formData.get('project') as string
  // la ddc concerné, dans laquelle il se trouve
  const concernedCollection = await prismadb.collection.findFirst({
    where: { id: collectionId}
  })
  // on update le project qu'il veut faire financer
  await prismadb.collectionParticipant.updateMany({
    where: {
      collectionId: concernedCollection?.id,
      profileId: connected?.id,
    },
    data: { project }
  });
  //    
  if(concernedCollection?.collectionType === "ddc")
  {
    revalidatePath(`/dashboard/ddc/${collectionId}`)
  }
  //
};
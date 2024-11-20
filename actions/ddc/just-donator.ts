"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

export const justDonator = async (collectionId: string) => {
  const connected = await currentUserInfos()
  const concernedCollection = await prismadb.collection.findFirst({
    where: { id: collectionId}
  })
  // 
  const  state = await prismadb.collectionParticipant.findFirst({
    where: {
      collectionId: concernedCollection?.id,
      profileId: connected?.id
    }
  })
  //
  if(state?.isOnlyDonator === false)
  {
    await prismadb.collectionParticipant.updateMany({
      where: {
        collectionId: concernedCollection?.id,
        profileId: connected?.id,
      },
      data: { isOnlyDonator: true }
    });
  }
  else{
    await prismadb.collectionParticipant.updateMany({
      where: {
        collectionId: concernedCollection?.id,
        profileId: connected?.id,
      },
      data: { isOnlyDonator: false }
    });
  }
  //
  //    
  if(concernedCollection?.collectionType === "ddc")
  {
    revalidatePath(`/dashboard/ddc/${collectionId}`)
  }
};
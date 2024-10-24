"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  if(concernedCollection?.collectionType === "tripl")
  {
    revalidatePath(`/dashboard/${collectionId}`)
    redirect(`/dashboard/${collectionId}`)
  }
  //
  if(concernedCollection?.collectionType === "snippets")
  {
    revalidatePath(`/dashboard/snippets/${collectionId}`)
    redirect(`/dashboard/snippets/${collectionId}`)
  }
  //
  if(concernedCollection?.collectionType === "totality")
    {
      revalidatePath(`/dashboard/totality/${collectionId}`)
      redirect(`/dashboard/totality/${collectionId}`)
    }
  //
};
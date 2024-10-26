"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateSnippetsProject = async (collectionId: string, formData: FormData ) => {
  const connected = await currentUserInfos()
  const project = formData.get('project') as string
  const concernedCollection = await prismadb.collection.findFirst({
    where: { id: collectionId}
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
  if(concernedCollection?.collectionType === "tripl")
  {
    revalidatePath(`/dashboard/tripl/${collectionId}`)
    redirect(`/dashboard/tripl/${collectionId}`)
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
"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const updateProject = async (collectionId: string, formData: FormData ) => {
  //
  const connected = await CurrentProfile()
  //
  const project = formData.get('project') as string
  //
  const concernedCollection = await prismadb.collection.findFirst({
    where: { id: collectionId }
  })
  //
  const participantCount = await prismadb.collectionParticipant.count({
    where: {
      profileId: connected?.id,
      collectionId: collectionId
    }
  })
  if(participantCount === 1)
  {
    //
    await prismadb.collectionParticipant.updateMany({
      where: {
        collectionId: concernedCollection?.id,
        profileId: connected?.id,
      },
      data: { project }
    });
    //
    revalidatePath(`/dashboard/tripl/${collectionId}`)
    redirect(`/dashboard/tripl/${collectionId}`)
  }
  //
};
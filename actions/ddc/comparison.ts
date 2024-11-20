"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";

export const comparison = async (collectionId: string) => {
  //const connected = await currentUserInfos()
  // ##4 test##
  const connectedtestor = await prismadb.currentProfileForTest.findFirst()
  // ##4 test##
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: connectedtestor?.usercodepin}
  })
  const concernedCollection = await prismadb.collection.findFirst({
    where: { id: collectionId}
  })
  // ceux qui participe à la ddc 
  const ddcParticipants = await prismadb.collectionParticipant.findMany({
    where: {
      collectionId: concernedCollection?.id
    },
    include: { profile: true }
  })
  // 
  const myreceivers = await prismadb.profilesMet.findMany({
    where: {
      profileId: connected?.id,
    },
    //select: { participantMetId: true }
  })
  
  return { myreceivers, ddcParticipants }
};
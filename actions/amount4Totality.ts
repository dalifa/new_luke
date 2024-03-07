"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";


export const amount4Totality = async () => {
  const profile = await currentUserInfos()
  //
  const userAmount = await prismadb.amount.findFirst({
    where: { currency: profile?.currency }
  })
  //
  await prismadb.collection.create({
    data: {
      amount: userAmount?.amount,
      currency: profile?.currency,
      email: profile?.googleEmail,
    },
  });
  // 
  if(profile?.credit && userAmount?.amount){
    const newcredit = profile?.credit - userAmount?.amount;
    //
    await prismadb.profile.updateMany({
      where: { googleEmail: profile?.googleEmail },
      data: { credit: newcredit}
    })
  }

};

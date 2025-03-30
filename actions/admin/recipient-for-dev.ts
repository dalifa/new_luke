"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
// 
export const recipientForDev = async (formData:any) => {
  const connected = await CurrentProfile();
  const amount = await prismadb.amount.findFirst({
    where: { rank: "three" } //  
  })
    if(connected && amount) // s'ils existent
    {
      // Enregistrement de l'activité
    await prismadb.canBeBlessed.create({
      data: {
        profileId: connected?.id,
        amountId: amount?.id,
        currency: connected?.currency,
        canBeDisplayed: true
      },
    }); 
    }
  //
};
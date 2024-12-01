"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

// ADD FAKE PROFLIE 4 TEST
export const addFakeProfile = async () => {
  //
  const profileCount = await prismadb.profile.count()
  // TO ADD FAKE PROFLIE 4 TEST
  /*
  const FakeProfile = await prismadb.profile.create({
    data: {
      username: "victoire",
      usercodepin: profileCount + 1000 + 1,
      phone: "0900000011",
      firstname:"vaillant",    
      lastname: "guérrier",    
      city: "meaux",
      countryId: "65988254ef3d78f14d98c0ff",
      bio: "profil avec v",
    }
  }) 
  // TO INCREASE FAKE PROFILE CREDIT
  await prismadb.profile.updateMany({
    data: {credit: 200}
  })
  // TO DERCREASE FAKE PROFILE JACKPOT
  await prismadb.profile.updateMany({
    data: {
      jackpot: 0,
      currency: "€"
    }
  })  */

  //
  revalidatePath("/dashboard/admin")
  //
};
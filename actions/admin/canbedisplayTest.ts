'use server'

import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"

//
export async function canbedisplayedTest(codepin: number, amount: number) {
  const connected = await CurrentProfile()
  try {
    const profile = await prismadb.profile.findFirst({
      where: { codepin }
    })
    //
    const theamount = await prismadb.amount.findFirst({
      where: { 
        amount,
        currency: "€"
       }
    })
    if(connected?.role === "USER" && profile && theamount) // ADMIN EN PROD
    {
      // S'IL N'EST PAS DANS CETTE TABLE ON CRÉE UN ENTRÉE
          await prismadb.canBeBlessed.create({
            data: {
              profileId: profile?.id,
              canBeDisplayed: true,
              maxDisplays: 2,
              amountId: theamount?.id ,
              currency: "€"
            }
          })          
          console.log("can be ok.")
          return { success: true }
    }  
  } catch (error) {
    console.error('[UPDATE_SUBSCRIPTION]', error)
    return { error: 'Erreur serveur' }
  }
}

/*
*/
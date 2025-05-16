'use server'

import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"

//
export async function updateSubscription(codepin: number, daysToAdd: number) {
  const connected = await CurrentProfile()
  try {
    const subscription = await prismadb.subscription.findFirst({
      where: { codepin },
    })
    if(connected?.role === "USER") // ADMIN EN PROD
    {
      // S'IL N'EST PAS DANS CETTE TABLE ON CRÉE UN ENTRÉE
      if (!subscription) {
        //return { error: 'Abonnement introuvable' }
        const concernedProfile = await prismadb.profile.findFirst({
          where: { codepin } // codepin = codepin celui-ci c'est celui qui est entrée dans le form
        })
        // on crée une entrée dans SUBSCRIPTION
        if(concernedProfile){
          await prismadb.subscription.create({
            data: {
              profileId: concernedProfile?.id,
              codepin,
              canParticipate: true,
              remainingDays: 30,
            }
          })
        }
      }
      // S'IL EST DÉJÀ DANS CETTE TABLE ON UPDATE L'ENTRÉE
      else{
        const currentDays = subscription.remainingDays || 0
        const newDays = currentDays + daysToAdd
        //
          await prismadb.subscription.update({
            where: { id: subscription.id },
            data: {
              remainingDays: newDays,
              canParticipate: true,
            },
          })
          //
          console.log("plus 30 jours d'abonnement.")
          return { success: true }
      }
    }  
  } catch (error) {
    console.error('[UPDATE_SUBSCRIPTION]', error)
    return { error: 'Erreur serveur' }
  }
}

/*
*/
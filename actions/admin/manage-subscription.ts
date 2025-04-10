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

    if (!subscription) {
      return { error: 'Abonnement introuvable' }
    }

    const currentDays = subscription.remainingDays || 0
    const newDays = currentDays + daysToAdd
    //
    if(connected?.role === "USER") // ADMIN EN PROD
    {
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
  } catch (error) {
    console.error('[UPDATE_SUBSCRIPTION]', error)
    return { error: 'Erreur serveur' }
  }
}

/*
*/
// cron/daily-check.ts (exécuté une fois par jour via cron)

import { prismadb } from "@/lib/prismadb";
//
export async function dailySubscriptionTick() {
  const activeSubscriptions = await prismadb.subscription.findMany({
    where: {
      remainingDays: {
        gt: 0,
      },
    },
  });

  for (const sub of activeSubscriptions) {
    const newDays = sub.remainingDays - 1;

    await prismadb.subscription.update({
      where: { id: sub.id },
      data: {
        remainingDays: newDays,
        //canParticipate: false,
      },
    });
    //
    if(newDays < 1)
    {
      await prismadb.subscription.update({
        where: { id: sub.id },
        data: {
          remainingDays: newDays,
          canParticipate: false,
        },
      });
    }
  }
}


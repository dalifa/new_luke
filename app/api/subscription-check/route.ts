// à faire lorsque le site sera en ligne
/*
Ensuite tu vas sur cron-job.org, tu ajoutes l'URL de cette route (https://tonsite.com/api/subscription-check) et tu choisis l'heure quotidienne (ex: 00:01).

✅ 2. Planifier avec un cron en hébergement type Vercel Cron ou Railway
Vercel a des Cron Jobs intégrés que tu peux configurer dans le dashboard.

Tu pointes vers la même API route GET /api/subscription-check.

Une fois ton site en production :

Va sur https://vercel.com/

Clique sur ton projet

Va dans l’onglet "Cron Jobs"

Clique sur "Create Cron Job"

Remplis :

Path → /api/subscription-check

Schedule → 0 1 * * * (tous les jours à 01h00 du matin)

Region → même que ton projet (souvent iad1)

*/
// app/api/subscription-check/route.ts
// app/api/cron/daily-subscription/route.ts

import { prismadb } from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
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
          canParticipate: newDays > 0,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CRON_SUBSCRIPTION_TICK]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}


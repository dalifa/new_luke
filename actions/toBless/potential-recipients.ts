// server actions
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
//
//

export async function selectPotentialRecipients(amountId: string) {
  const connected = await CurrentProfile();
  if (!connected) return;

  const maxMetric = await prismadb.metric.findFirst({
    select: { maxDisplays: true },
  });

  const maxDisplays = maxMetric?.maxDisplays ?? 1;

  const potentialRecipients = await prismadb.canBeBlessed.findMany({
    where: {
      canBeDisplayed: true,
      amountId,
      profileId: { not: connected.id },
      profile: {
        NOT: {
          OR: [
            { metProfiles: { some: { profileMetId: connected.id } } },
            { metByProfiles: { some: { profileId: connected.id } } },
          ],
        },
      },
    },
    take: maxDisplays,
  });

  // ✅ Redirection vers la bonne page après l'action
  redirect(`/dashboard/potentialRecipients/${amountId}`);
}

/*
*/
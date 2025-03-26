import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";

export async function POST(req: Request) {
  try {
    const { amountId } = await req.json();
    const connected = await CurrentProfile();
    if (!connected) return NextResponse.json({ count: 0 });

    const count = await prismadb.canBeBlessed.count({
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
    });

    console.log(`🔍 Nombre de bénéficiaires trouvés pour ${amountId} :`, count);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erreur API countPotentialRecipients:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}

//
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import Link from "next/link";

export const ToBless = async () => {
  const connected = await CurrentProfile();
  // vérif de l'abonnement
  const subscription = await prismadb.subscription.findFirst({
    where: {
      codepin: connected?.codepin,
    },
  });
  // select de tout les montant 
  const amounts: any = await prismadb.amount.findMany({
    where: { currency: connected?.currency },
  });
  // vérif si collecte non validé comme donor ou recipient
  const pendingParticipations = await prismadb.collectionParticipant.findMany({
    where: {
      recipientValidation: false,
      onStandBy: false,
      OR: [
        { participantId: connected?.id },
        { recipientId: connected?.id },
      ],
    },
  });

  return (
    <Card className="bg-white shadow-xl p-6 rounded-lg">
      <p className="text-center text-xl font-semibold text-gray-700 mb-4">
        REJOINDRE UN GROUPE
      </p>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {amounts.map((amount: any) => {
          // Cherche s’il y a une participation en attente pour ce montant
          const hasPendingForThisAmount = pendingParticipations.some(
            (p) => p.amountId === amount.id
          );

          const isDisabled =
            !subscription ||
            subscription.remainingDays <= 0 ||
            hasPendingForThisAmount;

          return (
            <div key={amount.id}>
              {isDisabled ? (
                <Button disabled variant="primary" className="w-full">
                  {amount.amount}{connected?.currency}
                </Button>
              ) : (
                <Link
                  href={`/dashboard/snippets/enter_snippets_confirm/${amount.id}`}
                >
                  <Button variant="primary" className="w-full">
                    {amount.amount}{connected?.currency}
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
export default ToBless;

/* 
*/
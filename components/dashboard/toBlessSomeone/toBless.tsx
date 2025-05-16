// composant tobless
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import Link from "next/link";

export const ToBless = async () => { 
  const connected = await CurrentProfile();
  // VÉRIFICATION DE L'ABONNEMENT DU CONNECTÉ
  const subscription = await prismadb.subscription.findFirst({
    where: {
      codepin: connected?.codepin
    }
  })
  //
  // on select tous les montants
  const amounts:any = await prismadb.amount.findMany({
    where: {currency: connected?.currency}
  })
  //
  //  

  return (
    <Card className="bg-white shadow-xl p-6 rounded-lg">
      <p className="text-center text-xl font-semibold text-gray-700 mb-4">
        BÉNIR
      </p>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {
          amounts.map((amount:any) => (
            <> 
              {
                // si le credi exist et s'il est >= au montant choisi 
                subscription && subscription?.remainingDays > 0 ? (
                  <Link href={`/dashboard/snippets/enter_snippets_confirm/${amount?.id}`}>
                    <Button variant="primary" className="w-full">{amount?.amount}{connected?.currency}</Button>
                  </Link>
                ):( 
                    <Button disabled variant="primary">{amount?.amount}{connected?.currency}x</Button>
                  )
                }
            </>
          ))
        }
      </div> 
    </Card>
  );
};

export default ToBless;

// ###
/*
{ one && metric && countOne >= metric?.maxDisplays && lastOneBlessCount < 1 && subscription?.remainingDays !== 0 ? (
  <AmountOneDialog amountId={ one?.id }/>
  ):(
    <Button className="bg-indigo-400 hover:bg-indigo-300">
      5€
    </Button>
)
}
*/
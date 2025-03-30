
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// TOUS LES DON QU'ON A PROMIS
export const DonationPromised = async () => {
  const connected = await CurrentProfile()
  //
  const myDonationPromise = await prismadb.myListToBless.findMany({
    where: {
      donorId: connected?.id,
      recipientValidation: false
    }, 
  })
  //  
  return ( 
    <Card className="bg-white shadow-blue-100 shadow-md p-4">
      <p className="text-center mb-3 font-semibold text-slate-600 text-xl lg:text-lg">
        PROMESSES DE DONS FAIT
      </p>
      <hr className="w-full mb-2"/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {
          myDonationPromise.map((donation) => (
            <div key={donation.id} className="rounded-md bg-green-600">
              <Link href={`/dashboard/listToBless/${donation?.amountId}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                {donation?.amount}{connected?.currency}
                </Button>
              </Link>
            </div>
          ))
        }
      </div>
    </Card>
  ); 
};

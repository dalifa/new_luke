
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// TOUS LES DONs QUE LE CONNECTÉ A PROMIS
export const DonationPromised = async () => {
  const connected = await CurrentProfile()
  //
  const recipientsNotYetChosenLists = await prismadb.myListToBless.findMany({
    where: {
      donorId: connected?.id,
      isRecipientChosen: false,
      recipientValidation: false
    }, 
  })
  //  
  const recipientsAlreadyChosenLists = await prismadb.myListToBless.findMany({
    where: {
      donorId: connected?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }, 
  })
  //
  return ( 
    <Card className="bg-white shadow-xl p-6 rounded-lg">
      <p className="text-center mb-3 text-xl font-semibold text-gray-700">PROMESSES DE DONS FAIT</p>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Already chosen recipients */}
        {recipientsAlreadyChosenLists.map((chosen) => (
          <div key={chosen.id} className="rounded-md bg-green-600">
            <Link href={`/dashboard/myRecipients/${chosen?.amountId}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {chosen?.amount}{connected?.currency}
              </Button>
            </Link>
          </div>
        ))}
        
        {/* Recipients not yet chosen */}
        {recipientsNotYetChosenLists.map((notChosen) => (
          <div key={notChosen.id} className="rounded-md bg-green-600">
            <Link href={`/dashboard/listToBless/${notChosen?.amountId}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {notChosen?.amount}{connected?.currency}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Card>
  ); 
};
/*
<Card className="bg-white shadow-blue-100 shadow-md p-4">
      <p className="text-center mb-3 font-semibold text-slate-600 text-xl lg:text-lg">
        PROMESSES DE DONS FAIT
      </p>
      <hr className="w-full mb-2"/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* choix du recipient fait * /}
        { 
          recipientsAlreadyChosenLists.map((chosen) => (
            <div key={chosen.id} className="rounded-md bg-green-600">
              <Link href={`/dashboard/myRecipients/${chosen?.amountId}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {chosen?.amount}{connected?.currency}
                </Button> 
              </Link>
            </div>
          ))
        }
        {/* choix du recipient pas encore fait * /}
        {
          recipientsNotYetChosenLists.map((notChosen) => (
            <div key={notChosen.id} className="rounded-md bg-green-600">
              <Link href={`/dashboard/listToBless/${notChosen?.amountId}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {notChosen?.amount}{connected?.currency}
                </Button>
              </Link>
            </div>
          ))
        }
      </div>
    </Card>
*/
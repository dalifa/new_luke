import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
import Link from "next/link"
// PROMESSE DE DON REÇU
export async function DonationReceived() {
  // on select le profile du connecté
  const connected = await CurrentProfile()
  // LISTE DE POTENTIELS DONATORS OÙ LE CONNECTÉ EST AFFICHÉ COMME RECIPIENT
  const potentialDonors = await prismadb.myPotentialRecipient.findMany({
    where: { 
      potentialRecipientId: connected?.id, 
      isRecipientChosen: false, 
    },
    include: {
      list: {
        include: {
          donor: true, // Récupère directement le profil du donateur
        },
      },
    },
  });
  
  
  //  OÙ JE SUIS CHOISI COMME RECIPIENT
  const chosenAsRecipientLists = await prismadb.myListToBless.findMany({
    where: {
      chosenRecipient: connected?.id,
      isRecipientChosen: true,
      recipientValidation: false
    }, 
    include: {
      donor: true
    }
  })
  //
  //
    return(
      <Card className="bg-white shadow-xl p-6 rounded-lg">
      <p className="text-center mb-3 text-xl font-semibold text-gray-700">PROMESSES DE DONS REÇU</p>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Chosen recipients */}
        {chosenAsRecipientLists.map((chosen) => (
          <div key={chosen.id} className="rounded-md bg-green-600">
            <Link href={`/dashboard/myDonors/${chosen?.amountId}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {chosen?.amount}{connected?.currency}
              </Button>
            </Link>
          </div>
        ))}
        
        {/* Potential donors */}
        {potentialDonors.map((potential) => (
          <div key={potential.id} className="rounded-md bg-green-600">
            <Link href={`/dashboard/potentialDonators/${potential?.list?.amountId}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {potential?.amount}{connected?.currency}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Card>
      
    )
}

/*
<Card className='bg-white shadow-blue-100 shadow-md p-4'>
        <p className='text-center mb-3 font-semibold text-slate-600 text-xl lg:text-lg'>
          PROMESSES DE DONS REÇU
        </p> 
        <hr className='w-full mb-2'/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* choix du recipient fait * / }
        {
          chosenAsRecipientLists.map((chosen) => (
            <div key={chosen.id} className="rounded-md bg-green-600">
              <Link href={`/dashboard/myDonors/${chosen?.amountId}`}> 
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {chosen?.amount}{connected?.currency}
                </Button> 
              </Link>
            </div>
          ))
        }
        {/* choix du recipient pas encore fait * / }
        {
          potentialDonors.map((potential) => (
            <div key={potential.id} className="rounded-md bg-green-600">
              <Link href={`/dashboard/potentialDonators/${potential?.list?.amountId}`}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {potential?.amount}{connected?.currency}
                </Button>
              </Link>
            </div>
          ))
        }
      </div>
      </Card>
*/
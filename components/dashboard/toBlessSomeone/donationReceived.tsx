import { Card } from "@/components/ui/card"
import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
// PROMESSE DE DON REÇU
export async function DonationReceived() {
  // on select le profile du connecté
  const connected = await CurrentProfile()
  //
  //
  //
    return(
      <Card className='bg-white shadow-blue-100 shadow-md p-4'>
        <p className='text-center mb-3 font-semibold text-slate-600 text-xl lg:text-lg'>
          PROMESSES DE DONS REÇU
        </p> 
        <hr className='w-full mb-2'/>
      </Card>
    )
}
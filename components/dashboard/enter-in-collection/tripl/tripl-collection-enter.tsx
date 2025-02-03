import { prismadb } from "@/lib/prismadb";
import { Card } from "@/components/ui/card";
import { CurrentProfile } from "@/hooks/own-current-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
//
export async function TriplCollectionEnter() {   
  const connected = await CurrentProfile()
  // on select tous les montants de la même monnaie que celle du connecté
  const amounts:any = await prismadb.amount.findMany({
    where: {currency: connected?.currency}
  })
  // 
  return(
    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
      <p className='text-center mb-4 font-semibold text-slate-600 text-xl lg:text-lg'>
        Participer à un Tripl 
      </p>
      <hr className='w-full mb-2'/>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">  
      {   
        amounts.map((amount:any) => (
          <>
          {
            // si le credi exist et s'il est >= au montant choisi
            connected && connected?.credit >= amount?.amount ? (
              <Link href={`/dashboard/tripl/enter-tripl-confirm/${amount?.id}`}>
                <Button variant="blue" className=" w-full">{amount?.amount}€</Button>
              </Link>
            ):(
                <Button disabled variant="blue">{amount?.amount}€</Button>
              )
          }        
          </>
        ))
      }
      </div>
  </Card>
  )
}
//

/*

*/
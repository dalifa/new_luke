import { prismadb } from "@/lib/prismadb";
import { Card } from "@/components/ui/card";
import { currentUserInfos } from "@/hooks/own-current-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
//
export async function OneofusEnter() {
  //   
  // const connected = await currentUserInfos()  // mettre ceci en prod
  // ##4 test##
  const connectedtestor = await prismadb.currentProfileForTest.findFirst()
  // ##4 test##
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: connectedtestor?.usercodepin}
  })
  // ### FIN 4 TEST ###
  // on select tous les montants
  const amounts:any = await prismadb.amount.findMany({
    where: {
      currency: connected?.currency
    }
  })
  // amount de rank = 1
  const rank1 = await prismadb.amount.findFirst({
    where: {
      currency: connected?.currency,
      rank: "1"
    }
  })

  //
  return(
    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>
        Participer à une collecte One Of Us
      </p>
      <hr className='w-full mb-4'/>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">  
      {   
        amounts.map((amount:any) => (
          <>
          {
            // pour evité d'affiché le premier montant
            amount?.rank !== rank1?.rank && (
              <>
              {
                // si le credi exist et s'il est >= au montant choisi
                connected && connected?.credit >= amount?.amount ? (
                  <Link href={`/dashboard/oneofus/enter-oneofus-confirm/${amount?.id}`}>
                    <Button variant="blue" className=" w-full">{amount?.amount}{amount?.currency}</Button>
                  </Link>
                ):(
                    <Button disabled variant="blue">{amount?.amount}{amount?.currency}</Button>
                  )
              }
              </>
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
import { prismadb } from "@/lib/prismadb";
import { Card } from "@/components/ui/card";
import { currentUserInfos } from "@/hooks/own-current-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// direct donation challenge
export async function DdcListEnter() {
  //   
  //const connected = await currentUserInfos()
  //### 4 tests
  const current = await prismadb.currentProfileForTest.findFirst()
  //
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: current?.usercodepin }
  })  //### fin 4 test 
  // on select tous les montants
  const amounts:any = await prismadb.amount.findMany()
  // 
  const metric = await prismadb.metric.findFirst()
  // les ddc de différents montants en cours
  const openDdcs = await prismadb.collection.findMany({
    where: {
      collectionType: "ddc",
      isGroupComplete: true,
      groupPlus: metric?.currentDdcGroup,
      isCollectionClosed: false
    },
    include: { collectionParticipants: true }
  })
  //  
  return(
    <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-500 text-md lg:text-lg'>
        Participer à un DDC
      </p>
      <hr className='w-full mb-4'/>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">  
      {   
        openDdcs.map((ddc:any) => (
          <> 
          {
            ddc?.amount > 1 && (
              <Link key={ddc?.id} href={`/dashboard/ddc/${ddc?.id}`}>
                <Button variant="violet" className=" w-full">{ddc?.amount}€</Button>
              </Link>
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
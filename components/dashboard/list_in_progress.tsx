//
import { prismadb } from "@/lib/prismadb";
import { Card } from "@/components/ui/card";
import { CurrentProfile } from "@/hooks/own-current-user";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider, 
    TooltipTrigger,
  } from "@/components/ui/tooltip"
// pour format date
import { format } from "date-fns"
// on crée une constance pour date
const DATE_FORMAT = "d MMM yyyy, HH:mm"

export async function ListInProgress() {
  // 
  const connected = await CurrentProfile()
  // les groupes en construction
  const openLists = await prismadb.collection.findMany({
    where: { 
      isGroupComplete: false
    },
    include: { amount: true }
  }) 
  //
  const openListsCount = await prismadb.collection.count({
    where: { 
      isGroupComplete: false
    }
  }) 
  //
  return (
    <Card className='bg-white shadow-xl p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-xl lg:text-lg'>
        GROUPE EN COURS...
      </p>
      <hr className='w-full mb-2'/>
      {/*  */}
      <div className='grid grid-cols-1 gap-2 bg-white'>
        {
          openLists && openLists.map((list) => (
            <p key={list.id}>{list?.groupStatus} personnes / {list?.group} pour bénir de {list?.amount?.amount}{list?.amount?.currency}</p>
          ))
        }
        { openListsCount === 0 && (<p className="text-center">Aucun groupe en construction</p>)}
      </div>
    </Card>
  )
}

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
  // dernier don fait ou last donation made
  const openLists = await prismadb.collection.findMany({
    where: { 
      isGroupComplete: false
    },
    include: { amount: true }
  }) 
  //
  //
  return (
    <Card className='bg-white shadow-xl p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-xl lg:text-lg'>
        Liste en construction 
      </p>
      <hr className='w-full mb-2'/>
      {/*  */}
      <div className='grid grid-cols-1 gap-2 bg-white'>
        {
          openLists && openLists.map((list) => (
            <p>Liste de {list?.amount?.amount}{list?.amount?.currency} avec {list?.groupStatus}/{list?.group} personnes</p>
          ))
        }
      </div>
    </Card>
  )
}

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

export async function Counters() {
  // 
  const connected = await CurrentProfile()
  // last donation
  const lastDonation = await prismadb.collectionResult.findFirst({
    where: { donatorProfileId: connected?.id },
    orderBy:{ id: "desc" }
  })
  // last jackpot
  const lastjackpot = await prismadb.collectionResult.findFirst({
    where: { 
      recipientProfileId: connected?.id,
      donationReceived: 2
     },
    orderBy:{ id: "desc" }
  })
  // on SELECT LE MONTANT DE CETTE DERNIER TRIPL
  const lastAmount = await prismadb.collection.findFirst({
    where: {id: lastjackpot?.collectionId }
  })
  // codes de demande de transfert
  const transferCodes = await prismadb.transferDemand.findMany({
    where: { 
      usercodepin: connected?.codepin,
      isUsed: false
    }
  }) 
  //
  return (
    <Card className='bg-white shadow-blue-100 shadow-md p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-xl lg:text-lg'>
        COMPTEURS
      </p>
      <hr className='w-full mb-2'/>
      {/* PIN = Personal Indentification Number */}
      <div className='grid grid-cols-1 gap-2 bg-white'>
        <div className="flex flex-row items-center justify-between text-slate-500">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className='mb-2 text-slate-500 font-medium text-md lg:text-lg cursor-pointer'>Code PIN:</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>Personal Identification Number</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-blue-700 font-semibold text-xl">{connected?.codepin}</p>
        </div>
        <div className="grid grid-cols-2 items-center text-slate-500 text-md md:text-lg justify-between">
            <p>Donné:</p>
            <p className="text-end">  
            {
              connected && connected?.given > 0 ? (
                <span className="text-green-800 font-semibold"> {connected?.given}{connected?.currency}</span>
              ):(
                  <span> 00{connected?.currency}</span>
                )
            }
            </p>
        </div>
        <div className="grid grid-cols-2 items-center text-slate-500 text-md md:text-lg justify-between">
          <p>Reçu:</p>
          <p className="text-end">
          {
            connected && connected?.received > 0 ? (
              <span className="text-green-800 font-semibold">&nbsp;{connected?.received}{connected?.currency}</span>
              ):(
                <span className="text-slate-500"> 00{connected?.currency}</span>
              )
          }
          </p>
        </div>
      </div>
    </Card>
  )
}

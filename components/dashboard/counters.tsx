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
    <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-xl lg:text-lg'>
        Vos compteurs
      </p>
      <hr className='w-full mb-2'/>
      {/* PIN = Personal Indentification Number */}
      <div className=' grid grid-cols-1 gap-4 bg-white'>
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
          <p className="text-blue-800 font-semibold text-xl">{connected?.codepin}</p>
        </div>
        <div className="w-full flex flex-row items-center justify-between text-slate-500 text-sm font-medium">
          <p className="text-slate-500 text-md md:text-lg">Crédit:  
            {
              connected && connected?.credit > 0 ? (
                <span className="text-green-800 font-semibold"> {connected?.credit}{connected?.currency}</span>
              ):(
                  <span className="text-slate-500"> 00{connected?.currency}</span>
                )
            }
          </p>
            <p className="text-slate-500 text-md md:text-lg">Cagnotte:  
              {/* cagnotte > 0 */}
              {
                connected && connected?.jackpot > 0 ? (
                  <span className="text-green-800 font-semibold">&nbsp;{connected?.jackpot}{connected?.currency}</span>
                ):(
                  <span className="text-slate-500"> 00{connected?.currency}</span>
                )
              }
            </p>
          </div>
          {/* dernier don fait et dernière cagnotte reçu */}
            <div className='w-full flex flex-col text-slate-500 text-sm font-medium mb-4 gap-y-2'> 
              {
                lastDonation && (
                  <div className="flex flex-row justify-between w-full">
                    <p>
                      Dernier don: <br/>
                      <span className="text-[10px]">{format(new Date(lastDonation.createdAt), DATE_FORMAT)}</span>
                    </p> 
                    <p>
                      <span className="font-semibold"> 
                        { lastDonation.amount}{lastDonation?.currency}
                      </span> 
                    </p>
                  </div>
                )
              }
              {
                lastjackpot && lastAmount && (
                  <div className="flex flex-row justify-between w-full">
                    <p>
                      Dernière cagnotte: <br/>
                        <span className="text-[10px]">{format(new Date(lastjackpot.createdAt), DATE_FORMAT)}</span>
                    </p>
                    <p>
                      <span className="font-semibold"> 
                        { lastAmount?.amount * 3 }{lastjackpot?.currency}
                      </span>
                    </p>
                  </div>
                )
              }
            </div>
            {/* code de demande de transfert */}
            <div className="w-full flex flex-col text-slate-500 text-sm font-medium">
              {
                transferCodes.map((transferCode) => (
                  <div key={transferCode.id} className="flex flex-col w-full mb-2">
                    <Separator className="bg-slate-100 mb-1"/>
                    <div className="flex w-full items-center justify-between mb-1">
                      <p>Code de retrait:</p>
                      <p><span className="text-blue-800 font-semibold">{ transferCode.transferCode}</span></p> 
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <p>Montant:</p>
                      <p><span className="text-green-800 font-semibold">{ transferCode.amountToTransfer}{connected?.currency}</span></p>
                    </div>
                  </div>
                ))
              }
            </div>
        </div>
      </Card>
    )
}

import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { Card } from "@/components/ui/card";
import { currentUserInfos } from "@/hooks/own-current-user";
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
    const connectedUser = await currentUserInfos()
    // last donation
    const lastDonation = await prismadb.collectionResult.findFirst({
        where: { donatorEmail: connectedUser?.googleEmail },
        orderBy:{ id: "desc" }
    })
    // last jackpot
    const lastjackpot = await prismadb.collectionResult.findFirst({
        where: { recipientEmail: connectedUser?.googleEmail },
        orderBy:{ id: "desc" }
    })
    //
    // codes de demande de transfert
    const transferCodes = await prismadb.transferDemand.findMany({
        where: { 
            usercodepin: connectedUser?.usercodepin,
            isUsed: false
        }
    })
    //
    return (
        <Card className='bg-white shadow-blue-200 shadow-lg p-4 flex items-center flex-col gap-2'>
            <p className='text-center mb-2 text-slate-500 font-semibold text-md lg:text-lg'>
                Vos compteurs
            </p>
            
            {/*PIN = Personal Indentification Number*/}
            <div className="flex w-full mb-2 items-center flex-row justify-between">
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <p className='mb-2 text-slate-600 font-medium text-sm lg:text-md cursor-pointer'>Code PIN:</p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Personal Identification Number</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                </div>
                <div className="">
                    <p className="text-blue-800 font-semibold">{connectedUser?.usercodepin}</p>
                </div>
            </div>
            {/* credit et cagnotte*/}
            <div className="w-full flex mb-4 flex-row items-center justify-between text-slate-600 text-sm font-medium">
                <p className="text-slate-600">Crédit:  
                    {
                        connectedUser?.credit && connectedUser.credit > 0 ? (
                            <span className="text-green-800 font-semibold"> {connectedUser?.credit}{connectedUser?.currency}</span>
                        ):(
                            <span className="text-slate-600"> 00{connectedUser?.currency}</span>
                        )
                    }
                    </p>
                    {/* ################## CAGNOTTE ##################### */}
                    <p className="text-slate-600">Cagnotte:  
                    {/* cagnotte > 0 */}
                    {
                        connectedUser && connectedUser?.jackpot > 0 && (
                            <span className="text-green-800 font-semibold">&nbsp;{connectedUser?.jackpot}</span>
                                    
                        )
                    }
                    {/* cagnotte = 0 et centimes = 0 */}
                    {
                        connectedUser && connectedUser?.jackpot == 0 && connectedUser.jackpotCents == 0 && (
                            <span className="text-green-800 font-semibold">&nbsp;00</span>            
                        )
                    }
                    {/* cagnotte = 0 et centimes > 0 */}
                    {
                        connectedUser && connectedUser?.jackpot < 1 && connectedUser.jackpotCents > 0 && (
                            <span className="text-green-800 font-semibold">&nbsp;0</span>
                                    
                        )
                    }
                    {/* ################# CENTIMES #################### */}
                    {/* QUANT LES CENTIMES SONT >= A 10 CTS*/}
                    {
                        connectedUser && connectedUser.jackpotCents >= 10 && (
                            <span className="text-green-800 font-semibold"> 
                                ,{connectedUser?.jackpotCents}
                            </span>
                                        
                        ) 
                    }
                    {/* QUAND LES CENTIMES SONT DE 01 A 09 CTS */}
                    {
                        connectedUser && connectedUser.jackpotCents >= 1 && connectedUser.jackpotCents < 10 && (
                            <span className="text-green-800 font-semibold"> 
                                ,0{connectedUser?.jackpotCents}
                            </span>
                                        
                        )
                          
                    }
                    {/* QUAND LES CENTIMES SONT == 0 CTS */}
                    {
                        connectedUser && connectedUser.jackpotCents < 1 && (
                            "" // on n'affiche rien             
                        )
                          
                    }
                    {/* ###################### CURRENCY #####################*/}
                    {/* cagnotte > 0 et centimes > 0*/}
                    {
                        connectedUser && connectedUser.jackpot > 0 && connectedUser.jackpotCents > 0 && (
                        <span className="text-green-800">{connectedUser.currency}</span>
                        )
                    }
                    {/* cagnotte = 0 et centimes > 0 */}
                    {
                        connectedUser && connectedUser.jackpot < 1 && connectedUser.jackpotCents > 0 && (
                        <span className="text-green-800">{connectedUser.currency}</span>
                        )
                    }
                    {/* cagnotte > 0 et centimes < 1 */}
                    {
                        connectedUser && connectedUser.jackpot > 0 && connectedUser.jackpotCents < 1 && (
                        <span className="text-green-800">{connectedUser.currency}</span>
                        )
                    }
                    {/* cagnotte < 1 et centimes < 1 */}
                    {
                        connectedUser && connectedUser.jackpot < 1 && connectedUser.jackpotCents < 1 && (
                        <span className="text-slate-600">{connectedUser.currency}</span>
                        )
                    }
                    </p>
            </div>
            {/* dernier don fait et dernière cagnotte reçu */}
            <div className='w-full flex flex-col text-slate-600 text-sm font-medium mb-4 gap-y-2'> 
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
                    lastjackpot && (
                        <div className="flex flex-row justify-between w-full">
                            <p>
                                Dernière cagnotte: <br/>
                                <span className="text-[10px]">{format(new Date(lastjackpot.createdAt), DATE_FORMAT)}</span>
                            </p>
                            <p>
                                <span className="font-semibold"> 
                                    { lastjackpot.amount}{lastjackpot?.currency}
                                </span>
                            </p>
                        </div>
                    )
                }
            </div>
            {/* code de demande de transfert */}
            <div className="w-full flex flex-col text-slate-600 text-sm font-medium">
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
                                <p><span className="text-green-800 font-semibold">{ transferCode.amountToTransfer}{connectedUser?.currency}</span></p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </Card>
    )
}

// list des demande de transfer en cours ....

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb"
import { Separator } from "../ui/separator";
 
const TransferDemandList = async () => {
    const connectedUser = await currentUserInfos()
    //
    const transferDemands = await prismadb.transferDemand.findMany({
        where: { 
            isUsed: false,
            //currency: connectedUser?.currency ?
        }
    })
    // 
    const transferCount = await prismadb.transferDemand.count({
        where: { 
            isUsed: false,
            currency: connectedUser?.currency
        }
    })
    // tous les profile pour avoir leur jackpot
    const profiles = await prismadb.profile.findMany()
    // 
    return (
        <div>
            <p className="mb-4 text-sm text-slate-600">
            Liste des membres qui demandent un transfert de leur cagnotte
            par MoMo ou de la main à la main. </p>
            {
                transferDemands.map((transferDemand) => (
                    <div key={transferDemand.id} className="border border-slate-500 mb-2 text-sm lg:text-md rounded-md p-2">
                        <p> Code PIN du membre: <span className="font-semibold text-blue-800"> { transferDemand?.usercodepin } </span></p>
                        <p> Sa cagnotte:
                            {
                                profiles.map((profile) => (
                                    <span key={profile.id}>
                                        {
                                            profile.usercodepin === transferDemand.usercodepin && (
                                                <span className="font-semibold text-green-700"> {profile.jackpot},{profile.jackpotCents}{profile.currency}</span>
                                            )
                                        }
                                    </span>
                                ))
                            }
                        </p>
                        <Separator className="bg-slate-200 my-2"/>
                        <p> Code de retrait: <span className="font-semibold text-blue-800">{ transferDemand?.transferCode } </span></p>
                        <p> Montant à transférer: <span className="font-semibold text-green-800">{ transferDemand?.amountToTransfer }{transferDemand?.currency} </span></p>
                        {/* {
                            connectedUser?.isPartner || connectedUser?.role === "ADMIN" && (
                                <p> - transfer code: { transferDemand?.transferCode } </p>
                            )
                            } */}
                    </div>
                ))
            }
        </div>
    )
}

export default TransferDemandList

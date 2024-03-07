import { auth } from '@/auth';
import { Counters } from '@/components/dashboard/counters';
import TransferDemandForm from '@/components/dashboard/transfer-demand';
import JackpotToCreditForm from '@/components/dashboard/transfer-jackpot-to-credit';
import { Card } from '@/components/ui/card';
import { currentUserInfos } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';

const Transfer = async () => {
    const session = await auth();
    // la redirection pour les non connectés est faite depuis le fichier middleware
    const connectedUser = await currentUserInfos()
    // s'il a déjà 2 demande de transfert en court
    const transferDemandCount = await prismadb.transferDemand.count({
        where: {
            usercodepin: connectedUser?.usercodepin, 
            isUsed: false
        }
    })
    return ( 
        <div className='h-ull flex items-center flex-col'>
            <div className='w-full md:w-4/5 flex flex-col items-center gap-y-4 m-4 p-5'>
                <div className='w-full grid grid-cols-1 gap-2 md:gap-4'>
                    <div>
                      <Counters/>
                    </div>
                    <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
                    <Card className='bg-white p-4 shadow-md shadow-slate-300'>
                        <div className='mb-10'>
                            <p className='text-center text-slate-500 text-md md:text-lg font-semibold'>
                                Transférer votre cagnotte vers votre crédit
                            </p>
                        </div>
                        <JackpotToCreditForm/>
                    </Card>
                    <Card className='bg-white p-4 shadow-md shadow-slate-300'>
                        <div className='mb-10'>
                            <p className='text-center text-slate-500 text-md md:text-lg font-semibold'>
                                Obtenir un code de retrait de cagnotte
                            </p>
                        </div>
                        {
                            transferDemandCount === 2 ? (
                                <p className='text-center text-blue-800 text-xs'>
                                    Vous avez déjà deux demandes en attente ...
                                </p>
                            ):(
                                <TransferDemandForm/>
                            )
                        }
                    </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transfer

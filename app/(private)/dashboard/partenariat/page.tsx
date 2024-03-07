import { auth } from '@/auth';
import PartnerCreditForm from '@/components/partner/partner-credit';
import PartnerTransferForm from '@/components/partner/partner-transfer';
import TransferDemandList from '@/components/partner/transferDemandList';
import { Card } from '@/components/ui/card';
import { currentUserInfos } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';

// 
const Partner = async () => {
    // la redirection pour les non connectés est faite depuis le fichier middleware
    const connectedUser = await currentUserInfos()
    //
    const metrics = await prismadb.metric.findFirst()
    //
    return (
        <div className='h-ull flex items-center flex-col'>
            <div className='w-full lg:w-4/5 flex flex-col items-center gap-y-5 m-4 p-5'>
                <div className='grid grid-cols-1 gap-2 lg:grid-cols-3 w-full p-5 rounded shadow-md bg-blue-50'>
                    <div>
                       <p className='text-center text-md md:text-lg font-semibold text-blue-800'>
                        Max partner credit:  
                       <span className='text-slate-600'> { connectedUser?.maxPartnerCredit}</span>
                       {connectedUser?.currency} 
                       </p>
                    </div>
                    <div>
                       <p className='text-center text-md md:text-lg font-semibold text-blue-800'>
                        Encaissable:  
                       <span className='text-green-700'> { connectedUser?.partnerCredit}</span>
                       {connectedUser?.currency} 
                       </p> 
                    </div>
                    <div>
                       <p className='text-center text-md md:text-lg font-semibold text-blue-800'>
                        Transférable: {connectedUser?.partnerCreditToRemit}{connectedUser?.currency}
                       </p>
                    </div>
                </div>
                <div className='w-full'> 
                    {
                        connectedUser?.isPartner === true && (
                            <TransferDemandList/>
                        )
                    }
                </div>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
                    <Card className='border-2 border-green-600 p-4'>
                        <div className='mb-10'>
                            <p className='text-center text-blue-800 text-md md:text-lg font-semibold'>
                                Enregistrer un retrait de cagnotte
                            </p>
                        </div>
                        {
                            connectedUser?.isPartner === true ? (
                                <PartnerTransferForm/>
                            ): (
                                <p className='text-sm text-slate-500 text-center'>Vous n'etes pas un de nos partenaire</p>
                            )
                        }
                    </Card>
                    <Card className=' border-2 border-violet-600 p-4'>
                        <div className='mb-10'>
                            <p className='text-center text-blue-800 text-md md:text-lg font-semibold'>
                                Créditer le compte d'un membre
                            </p>
                        </div>
                        {
                            connectedUser?.isPartner === true ? (
                                <PartnerCreditForm/>
                            ) : (
                                <p className='text-sm text-slate-500 text-center'>Vous n'etes pas un de nos partenaire</p>
                            )
                        }
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Partner

import BackCancel from "@/components/dashboard/action-in-collection/backCancelled"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { currentUserInfos } from "@/hooks/own-current-user"
import UpdateObjectToFinance from "@/components/dashboard/object-to-finance"
import { prismadb } from "@/lib/prismadb"
import { AmountTwoTotalityCollectionEnter } from "@/components/dashboard/enter-in-collection/amountTwo-totality-collectionEnter"


const confirmEnterTotalityAmountTwo = async () => {
    const connectedProfile = await currentUserInfos()
    // somme 2   
    const myAmountTwo = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency,
            rank: "two"
        }
    })
    return (
        <div className='w-full flex items-center justify-center flex-col'>
            <div className='flex w-4/5 md:w-2/5 items-center justify-center flex-col'>
                <Card className='w-full mt-20 p-5 bg-white text-blue-800 items-center shadow-slate-300 shadow-lg'>
                    <CardHeader className="text-md text-center lg:text-lg font-semibold">
                        Collecte Totality
                    </CardHeader>
                    <div className="mb-5">
                        <UpdateObjectToFinance/>
                    </div>
                    <CardDescription className="mb-10 text-slate-500 text-sm lg:text-md text-center leading-relaxed">
                        Confirmez-vous votre entrée dans une collecte Totality de {myAmountTwo?.amount}{myAmountTwo?.currency} ?
                    </CardDescription>
                    <div className="grid grid-cols-2 gap-x-5">
                        <BackCancel/>
                        <AmountTwoTotalityCollectionEnter>
                          Confirmer
                        </AmountTwoTotalityCollectionEnter>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default confirmEnterTotalityAmountTwo


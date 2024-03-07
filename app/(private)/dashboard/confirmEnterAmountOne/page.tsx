import BackCancel from "@/components/dashboard/action-in-collection/backCancelled"
import { AmountOneCollectionEnter } from "@/components/dashboard/amountOne-collectionEnter"
import UpdateObjectToFinance from "@/components/dashboard/object-to-finance"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { currentUserInfos } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"


const confirmEnterAmountOne = async () => {
    // en prod 
    const connectedProfile = await currentUserInfos()
    // somme 1 
    const myAmountOne = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency,
            rank: "one"
        }
    })
    return (
        <div className='w-full flex items-center justify-center flex-col'>
            <div className='flex w-full p-4 md:w-2/5 items-center justify-center flex-col'>
                <Card className='w-full mt-20 p-5 bg-white text-blue-800 items-center shadow-slate-300 shadow-lg'>
                    <CardHeader className="text-md text-center lg:text-lg font-semibold">
                        Collecte Snippet 
                    </CardHeader> 
                    <div className="mb-5">
                        <UpdateObjectToFinance/>
                    </div>
                    <CardDescription className="mb-10 text-slate-500 text-sm lg:text-md text-center leading-relaxed">
                        Confirmez-vous votre entrée dans une collecte Snippet de {myAmountOne?.amount}{myAmountOne?.currency} ?
                    </CardDescription>
                    
                    <div className="grid grid-cols-2 gap-x-5">
                        <BackCancel/>
                        <AmountOneCollectionEnter>
                          Confirmer
                        </AmountOneCollectionEnter>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default confirmEnterAmountOne

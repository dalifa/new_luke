import BackCancel from "@/components/dashboard/action-in-collection/backCancelled"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { currentUserInfos } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb" 
import { AmountThreeCollectionEnter } from "@/components/dashboard/enter-in-collection/amountThree-collectionEnter"
//
const confirmEnterAmountThree = async () => {
    const connectedProfile = await currentUserInfos()
    // somme 3   
    const myAmountThree = await prismadb.amount.findFirst({
        where: { 
            currency: connectedProfile?.currency,
            rank: "three"
        }
    })
    return (
        <div className='w-full flex items-center justify-center flex-col'>
            <div className='flex w-4/5 md:w-2/5 items-center justify-center flex-col'>
                <Card className='w-full mt-20 p-5 bg-white text-blue-500 items-center shadow-slate-300 shadow-lg'>
                    <CardHeader className="text-md text-center lg:text-lg font-semibold">
                        Collecte
                    </CardHeader>
                    <CardDescription className="mb-10 text-slate-500 text-sm lg:text-md text-center leading-relaxed">
                        Confirmez-vous votre entrée dans une collecte de {myAmountThree?.amount}{myAmountThree?.currency} ?
                    </CardDescription>
                    <div className="grid grid-cols-2 gap-x-5">
                        <BackCancel/>
                        <AmountThreeCollectionEnter>
                          Confirmer
                        </AmountThreeCollectionEnter>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default confirmEnterAmountThree


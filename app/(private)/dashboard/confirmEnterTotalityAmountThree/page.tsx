import BackCancel from "@/components/dashboard/action-in-collection/backCancelled"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { currentUserInfos } from "@/hooks/own-current-user"
import UpdateObjectToFinance from "@/components/dashboard/object-to-finance"
import { prismadb } from "@/lib/prismadb" 
import { AmountThreeTotalityCollectionEnter } from "@/components/dashboard/enter-in-collection/amountThree-totality-collectionEnter"


const confirmEnterTotalityAmountThree = async () => {
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
                <Card className='w-full mt-20 p-4 bg-white text-blue-500 items-center shadow-md'>
                    <CardHeader className="text-lg text-center lg:text-xl font-semibold">
                        Collecte Totality
                    </CardHeader>
                    {/* <div className="mb-5">
                        <UpdateObjectToFinance/>
                    </div> */}
                    <CardDescription className="mb-10 text-slate-500 text-md lg:text-lg text-center leading-relaxed px-2">
                        Confirmez-vous votre entrée dans une collecte Totality de {myAmountThree?.amount}{myAmountThree?.currency} ?
                    </CardDescription>
                    <div className="grid grid-cols-2 gap-x-5">
                        <BackCancel/>
                        <AmountThreeTotalityCollectionEnter>
                          Confirmer
                        </AmountThreeTotalityCollectionEnter>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default confirmEnterTotalityAmountThree


import { enterInSnippetsCollectionAction } from "@/actions/enter/enter-in-snippets-action"
import GoBack from "@/components/dashboard/enter-in-collection/cancel-button"
import { ConfirmSnippetsEnter } from "@/components/dashboard/enter-in-collection/confirm-snippets-enter"
import { Card } from "@/components/ui/card"
import { prismadb } from "@/lib/prismadb"
//
const ConfirEnterSnippets = async ({params}:{params: {snippetsId:string}}) => {
  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params?.snippetsId }
  })
  //
  const amountId = params.snippetsId; 
  const enterSnippetsAmountId = enterInSnippetsCollectionAction.bind(null, amountId);
  //
  return (
    <div className="flex flex-col w-full h-full pt-10 lg:pt-14 items-center justify-center">
      <div className="flex flex-col w-full h-screen pt-[20%] lg:pt-[10%] items-center">
        <Card className="w-4/5 lg:w-2/5 p-5 lg:py-10 border-2 shadow-md shadow-blue-100">
          <div className="flex flex-row items-center justify-center">
            <h1 className="font-semibold text-violet-800 text-xl">Participation à une collecte Snippets</h1>
          </div>
          <div className="flex flex-col pt-10 items-center justify-center ">
            <h2 className="text-justify">Confirmez-vous votre entrée dans une collecte Snippets de <span className="font-medium ">{concernedAmount?.amount}€</span> </h2>
            <div className="grid grid-cols-2 gap-10 mt-10">
              <GoBack/>
              <form action={enterSnippetsAmountId}>
                <ConfirmSnippetsEnter/>
              </form>
            </div> 
          </div>
        </Card>
      </div>
    </div>
  )
}
//
export default ConfirEnterSnippets

import { enterInOneofusAction } from "@/actions/oneofus/enter-in-oneofus-action"
import GoBack from "@/components/dashboard/enter-in-collection/cancel-button"
import { ConfirmEnterOneofusButton } from "@/components/dashboard/enter-in-collection/oneofus/confirm-enter-button"
import { Card } from "@/components/ui/card"
import { prismadb } from "@/lib/prismadb"
//
const ConfirmEnterOneofus = async ({params}:{params: {oneofusId:string}}) => {
  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params?.oneofusId }
  })
  //
  const amountId = params.oneofusId;
  const enterOneofusAmountId = enterInOneofusAction.bind(null, amountId);
  //
  return (
    <div className="flex flex-col w-full h-full pt-10 lg:pt-14 items-center justify-center">
      <div className="flex flex-col w-full h-screen pt-[20%] lg:pt-[10%] items-center">
        <Card className="w-4/5 lg:w-2/5 p-5 lg:py-10 border-2 shadow-md shadow-blue-200">
          <div className="flex flex-row items-center justify-center">
            <h1 className="font-semibold text-blue-600 text-xl">Participation à une collecte One Of Us</h1>
          </div>
          <div className="flex flex-col pt-10 items-center justify-center ">
            <h2 className="text-justify">Confirmez-vous votre entrée dans une collecte One Of Us de <span className="font-medium ">{concernedAmount?.amount}{concernedAmount?.currency}</span> </h2>
            <div className="grid grid-cols-2 gap-10 mt-10">
              <GoBack/>
              <form action={enterOneofusAmountId}>
                <ConfirmEnterOneofusButton/>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
//
export default ConfirmEnterOneofus

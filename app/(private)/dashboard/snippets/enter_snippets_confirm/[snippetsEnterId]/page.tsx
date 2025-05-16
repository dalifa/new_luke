import { enterInSnippetsAction } from "@/actions/snippets/enter_in_snippets_action"
import GoBack from "@/components/dashboard/snippets/cancel-button"
import { ConfirmEnterSnippets } from "@/components/dashboard/snippets/confirm-enter-button"
import { Card } from "@/components/ui/card"
import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
//
const ConfirmEnterInSnippets = async ({params}:{params: {snippetsEnterId:string}}) => {
  const connected = await CurrentProfile();
  //
  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params?.snippetsEnterId }
  })
  // s'il est déjà dans une liste où le recipient n'a pas encore validé
  const existingPendingParticipation = await prismadb.collectionParticipant.findFirst({
    where: {
      recipientValidation: false,
      amountId: concernedAmount?.id,
      OR: [
        { donorId: connected?.id },
        { potentialRecipient: connected?.id }
      ]
    }
  });
  
  //
  const amountId = params.snippetsEnterId;
  const enterInASnippetsAmountId = enterInSnippetsAction.bind(null, amountId);
  // 
  return (
    <div className="flex flex-col w-full h-full pt-10 lg:pt-14 items-center justify-center bg-indigo-600">
      <div className="flex flex-col w-full h-screen pt-[20%] lg:pt-[10%] items-center">
        {
           !existingPendingParticipation ? (
          <Card className="w-4/5 lg:w-2/5 px-5 py-10 lg:py-10 border-2 shadow-xl">
            <div className="flex flex-row items-center justify-center">
              <h1 className="text-center font-semibold text-indigo-600 text-2xl">Rejoindre une liste pour bénir</h1>
            </div>
            <div className="flex flex-col pt-10 items-center justify-center">
              <h2 className="text-center">Confirmez-vous vouloir bénir de <span className="font-medium ">{concernedAmount?.amount}€</span> </h2>
              <div className="grid grid-cols-2 gap-10 mt-10">
                <GoBack/>
                <form action={enterInASnippetsAmountId}>
                  <ConfirmEnterSnippets/>
                </form>
              </div>
            </div>
          </Card>):(
          <Card className="w-4/5 lg:w-2/5 px-5 py-10 lg:py-10 border-2 shadow-xl">
            <div className="flex flex-row items-center justify-center">
              <h1 className="text-center font-semibold text-indigo-600 text-2xl">
                Vous avez déjà une Liste de bénédictions de {concernedAmount?.amount}{connected?.currency} qui n&apos;est pas cloturée.
              </h1>
            </div>
          </Card>
          )
        }
      </div>
    </div>
  )
}
//
export default ConfirmEnterInSnippets

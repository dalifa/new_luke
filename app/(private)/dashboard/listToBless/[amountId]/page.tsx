import ConfirmTheBlessingForm from '@/components/dashboard/toBlessSomeone/amountForm/confirmTheBlessingForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { capitalize, CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import { ShieldAlert, UserRound } from 'lucide-react'
//

const ListToBless = async ({ params }: { params: { amountId: string } }) => {
  const connected = await CurrentProfile();

  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params?.amountId },
  });

  const recipients = await prismadb.myListToBless.findMany({
    where: {
      amountId: concernedAmount?.id,
      donorId: connected?.id,
      recipientValidation: false,
    },
    include: {
      potentialRecipients: {
        include: {
          recipient: true, // 🔹 Récupère les infos du bénéficiaire
        },
      },
    },
  }); 

  // Extraction des bénéficiaires potentiels avec leur montant
  const potentialRecipientsList = recipients.flatMap((list:any) =>
    list.potentialRecipients.map((p:any) => ({
      recipient: p.recipient,
      potentialAmount: list.amount, // ✅ Le montant est maintenant inclus
    }))
  ); 

  return (
    <Card className="bg-indigo-600 border-4 border-indigo-400 shadow-xl py-10 px-2 md:px-5 mx-2 md:mx-10 my-16">
      <h2 className="text-center text-white mb-4 font-semibold text-2xl lg:text-3xl">
        Bénéficiaires potentiels de vos {concernedAmount?.amount}
        {concernedAmount?.currency}
      </h2>
      <Separator className='bg-indigo-400 my-10 border-2 border-indigo-400 ' />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* il faut laisser les deux : {recipient, potentialRecipients} pour que ça marche */}
        {potentialRecipientsList.map(({recipient, potentialRecipients}) => (
          <Card
            key={recipient.id}
            className="flex flex-col items-center p-4 text-xl gap-3 text-slate-700"
          >
            <Avatar className="h-20 w-20 lg:h-24 lg:w-24">
              {recipient.googleImage && (
                <AvatarImage src={recipient.googleImage} />)}
                <AvatarFallback className="bg-indigo-600">
                  <UserRound className="text-white h-14 w-14" />
                </AvatarFallback>
            </Avatar>
            <p className="text-xl capitalize font-semibold text-indigo-600">
              {recipient.username}
            </p>
            <p className="break-words text-center">{capitalize(recipient.bio)}</p>
            <p className="text-gray-500">{capitalize(recipient.city)}</p>
            <p>{capitalize(recipient.country)}</p>

            <Dialog> 
              <DialogTrigger className="w-3/5 text-xl bg-indigo-600 hover:bg-indigo-500 rounded-md text-white p-2">
                Bénir de {concernedAmount?.amount}{concernedAmount?.currency}
              </DialogTrigger>
              <DialogContent className="w-4/5 rounded-md">
                <DialogHeader className="flex flex-col gap-4 mb-4">
                  <DialogTitle className="text-xl/10 text-center text-indigo-600 mt-2">
                    Bénir librement <br/> 
                    <span className='text-slate-700'>{capitalize(recipient?.username)} de   {concernedAmount?.amount}{concernedAmount?.currency}</span>
                  </DialogTitle> 
                  <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
                    <ShieldAlert className='text-orange-600'/>
                    <DialogDescription className="text-xl gap-x-2 ">
                      Votre engagement sera irréversible
                    </DialogDescription>
                  </div>
                  
                </DialogHeader> 
                { concernedAmount && ( <ConfirmTheBlessingForm amountId={concernedAmount?.id} recipientId={recipient?.id}/> )}
                <DialogClose className="w-full text-xl p-2 rounded-md border-2 hover:border-red-300 hover:text-rose-500">
                  Je renonce
                </DialogClose>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div> 
    </Card>
  );
};

export default ListToBless;

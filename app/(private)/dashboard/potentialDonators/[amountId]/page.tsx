import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { capitalize, CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import { UserRound } from 'lucide-react'
import React from 'react'
// CEUX CHEZ QUI JE SUIS AFFICHÉ, DONC MES POTENTIELS DONATEURS
const ListToBless = async ({ params }: { params: { amountId: string } }) => {
  const connected = await CurrentProfile();

  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params?.amountId },
  });

  const potentialDonors = await prismadb.myPotentialRecipient.findMany({
    where: { 
      potentialRecipientId: connected?.id, // Le connecté est affiché comme bénéficiaire potentiel
      isRecipientChosen: false, // Il n'a pas encore été choisi
    },
    include: {
      list: {
        include: {
          donor: true, // Récupère directement le profil du donateur
        },
      },
    },
  });
  //
  return (
    <Card className="bg-white shadow-blue-100 shadow-md p-4 m-4">
      <h2 className="text-center mb-4 font-semibold text-slate-700 text-xl lg:text-2xl">
        Peuvent vous bénir de {concernedAmount?.amount}{concernedAmount?.currency}
      </h2>
      <hr className="w-full mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* il faut laisser les deux : {recipient, potentialRecipients} pour que ça marche */}
        {potentialDonors.map((potential) => (
          <Card
            key={potential.id}
            className="flex flex-col items-center p-4 text-xl gap-3"
          >
            <Avatar className="h-20 w-20 lg:h-24 lg:w-24">
              {potential?.list?.donor?.googleImage && (
                <AvatarImage src={potential?.list?.donor?.googleImage} />)}
                <AvatarFallback className="bg-blue-500">
                  <UserRound className="text-white h-14 w-14" />
                </AvatarFallback>
            </Avatar>
            <p className="text-xl capitalize font-semibold text-blue-500">
              {potential?.list?.donor?.username}
            </p>
            <p className="break-words">{capitalize(potential?.list?.donor?.bio)}</p>
            <p className="text-gray-500">{capitalize(potential?.list?.donor?.city)}</p>
            <p>{capitalize(potential?.list?.donor?.country)}</p>
            <div>
              <p>pourrais vous bénir de {potential?.list?.amount}{connected?.currency}</p>
            </div>
          </Card>
        ))}
      </div> 
    </Card>
  );
};

export default ListToBless;


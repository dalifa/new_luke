//
import ValidateDonationForm from '@/components/dashboard/toBlessSomeone/recipientValidationForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { capitalize, CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import { Bell, Building2, CheckSquare, HandCoins, MapPin, Phone, UserRound } from 'lucide-react'
import { format } from 'date-fns'
//
const DATE_FORMAT = "d MMM yyyy, HH:mm"

// CEUX QUI ONT CHOISI DE BENIR LE CONNECTÉ
const MyConfirmedDonors = async ({params}:{params: {amountId: string}}) => {
  const connected = await CurrentProfile()
  //
  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params?.amountId }
  })
  //
  const confirmedDonorsLists = await prismadb.myListToBless.findMany({
    where: { 
      chosenRecipient: connected?.id, // Vérifie si le connecté est le recipient choisi
      recipientValidation: false, // Filtrer ceux qui n'ont pas encore validé
    },
    include: {
      donor: true, // Récupère les infos du donateur (Assurez-vous que donorId référence un Profile)
    },
  });
  // fixed top-5 left-0 w-full bg-white p-4 shadow-md z-10"
  return(
    <div className="flex flex-col items-center min-h-screen pt-5 bg-indigo-600">
  {/* Formulaire fixé en haut * / }
  <div className="w-full flex justify-center border-2 border-red-500"> */}
  <div className='fixed top-12  flex flex-col justify-center items-center w-full max-w-4xl bg-white'>
    <div className="w-full sm:w-4/5 md:w-3/5 p-4 bg-indigo-600">
      <p className='my-4 text-white font-medium text-center text-xl'>
        Valider avoir été béni via Wéro
      </p>
      {connected && <ValidateDonationForm recipientId={connected?.id} />}
    </div>
  </div>

  {/* Contenu principal centré */}
  <div className="flex flex-col justify-center items-center mt-24 lg:mt-32 p-4 w-full max-w-4xl">
    {confirmedDonorsLists && confirmedDonorsLists.map((confirmed: any) => (
      <Card 
        key={confirmed?.id} 
        className="bg-white shadow-md py-6 px-3 w-full sm:w-4/5 md:w-3/5 text-center mt-6"
      >
        {/* 💰 Titre avec statut du donateur */}
        <h2 className="text-xl font-semibold text-indigo-600 mt-10 mb-4">
          {confirmed?.donatorValidation ? (
            <span>A confirmé vous avoir béni via Wéro &nbsp;</span>
          ) : (
            <span>S&apos;engage à vous bénir&nbsp;</span>
          )}
          de {concernedAmount?.amount} {concernedAmount?.currency}
        </h2>
        { !confirmed?.donatorValidation && confirmed?.recipientChosenAt && (<p>Le:&nbsp;{format(new Date(confirmed?.recipientChosenAt), DATE_FORMAT)}</p>)}
        <hr className="mb-4" />

        {/* Infos Donateur */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="w-full grid grid-cols-2 gap-4 my-4 items-center">
            <Avatar className="h-20 w-20">
              {confirmed?.donor && <AvatarImage src={confirmed?.donor?.googleImage} />}
              <AvatarFallback className="bg-indigo-600 text-white">
                {confirmed?.donor?.firstname}
              </AvatarFallback>
            </Avatar>
            <p className="text-lg break-words font-semibold text-slate-600">
              {capitalize(confirmed?.donor?.username)}
            </p>
          </div>

          {/* Infos supplémentaires */}
          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <UserRound className="text-indigo-600" />
            <p className="text-lg text-slate-600 break-words font-semibold">
              {capitalize(confirmed?.donor?.firstname)}
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <MapPin className="text-indigo-600" />
            <p className="text-slate-600 break-words">
              {capitalize(confirmed?.donor?.country)}
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <HandCoins className="text-indigo-600" />
            <p className="text-xl font-bold text-green-600">
              {concernedAmount?.amount} {concernedAmount?.currency}
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-2">
            <Building2 className="text-indigo-600" />
            <p className="text-slate-600 break-words">
              {capitalize(confirmed?.donor?.bio)}
            </p>
          </div>

          <Separator className="my-4"/>

          <div className='text-slate-600 mb-4'> 
            { confirmed?.donorConfirmedAt && (<p>Confirmé le:</p>)}
            { confirmed?.donorConfirmedAt && (<p>{format(new Date(confirmed?.donorConfirmedAt), DATE_FORMAT)}</p>)}
          </div>

          {/* Validation WERO & SMS */}
          {confirmed?.donatorValidation && (
            <>
              <div className="w-full grid grid-cols-2 gap-4">
                <CheckSquare className="text-indigo-600" />
                <p className="text-slate-600">WERO <span className="text-green-600">OK</span></p>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <Bell className="text-indigo-600" />
                <p className="text-slate-600">SMS <span className="text-green-600">OK</span></p>
              </div>

              <div className="w-full grid grid-cols-1 mt-4">
                <p className="text-slate-600">
                  Merci de valider la réception du don de votre côté, 
                  pour permettre à votre donateur de figurer dans une liste de personnes à bénir.
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    ))}
  </div>
</div>

  )
}
//
export default MyConfirmedDonors
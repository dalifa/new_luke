import { Card } from '@/components/ui/card'
import { capitalize, CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// pour format date
import { format } from "date-fns"
import { Building2, HandCoins, MapPin, UserRound } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
// on crée une constance pour date
const DATE_FORMAT = "d MMM yyyy, HH:mm"

const HistoryDetails = async ({
    params
  }: {
    // historiqueId = le nom du fichier s'il est différent, ça ne marche pas
    params: { historiqueId: string }
  }) => {
    const connected = await CurrentProfile()
    // concerned list
    const concernedList = await prismadb.myListToBless.findFirst({
      where: {
        id: params?.historiqueId,
        recipientValidation: true
      }
    })
    // MY DONATOR IN THIS LIST
    const donator = await prismadb.profile.findFirst({
      where: {
        id: concernedList?.donorId,
      }
    })
    // on select les participants concernés
    const participants = await prismadb.myPotentialRecipient.findMany({
      where: {
        listToBlessId: params?.historiqueId,
      },
      include: {
        recipient: true, // pour les infos de profil
      },
    });    
    //
    //
    return (
        <div className='pt-2 h-ull flex items-center flex-col'>
            <div className='w-full lg:w-4/5 flex flex-col items-center gap-y-4 m-4 px-4'>
                <Card className='w-full flex flex-col p-4 gap-y-2 mb-2 text-center text-slate-700 shadow-md shadow-blue-100'>
                  <p className='text-lg md:text-xl'>Historique de la liste n°{concernedList?.ownId}</p>
                </Card>
                <div className='w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4'>
                <Card 
                  key={donator?.id} className="bg-white shadow-md py-6 px-3 w-full text-center mt-6"
                >
                {/* Infos Donateur */}
                  <div className="w-full grid grid-cols-2 gap-4 my-4 items-center">
                    <Avatar className="h-20 w-20">
                      { donator?.googleImage && (<AvatarImage src={donator?.googleImage} />) }
                      <AvatarFallback className="bg-blue-500 text-white text-3xl">
                        {donator?.firstname?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    { donator &&  (<p className="text-lg break-words font-semibold text-slate-600">
                      {capitalize(donator?.username)}
                    </p>)}
                  </div>
                  {/* Infos supplémentaires */}
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <UserRound className="text-blue-500" />
                    {donator && (<p className="text-lg text-slate-600 break-words font-semibold">
                      {capitalize(donator?.firstname)}
                    </p>)}
                </div>
                <div className="w-full grid grid-cols-2 gap-4 mt-2">
                  <MapPin className="text-blue-500" />
                  {donator && (<p className="text-slate-600 break-words">
                    {capitalize(donator?.country)}
                  </p>)}
                </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <HandCoins className="text-blue-500" />
                    {donator && (<p className="text-xl font-bold text-green-600">
                      {concernedList?.amount} {connected?.currency}
                    </p>)}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <Building2 className="text-blue-500"/>
                    {donator && (<p className="text-slate-600 break-words">
                      {capitalize(donator?.bio)}
                    </p>)}
                  </div>
                  { donator?.id === concernedList?.donorId && (
                  <div className="w-full grid grid-cols-2 gap-4 mt-4 text-slate-500">
                    <div>
                      <p className='text-start'>Validation reçu le:</p>
                    </div>
                    <div>
                      {concernedList?.recipientConfirmedAt &&(<p>{format(new Date(concernedList?.recipientConfirmedAt), DATE_FORMAT)}</p>)}
                    </div>
                  </div>)}
                  <Separator className="my-4"/>
                  <p className='text-xl font font-medium text-blue-500'>Donateur</p>
                </Card>


                { participants.map((competitor) => (
                  <Card 
                  key={competitor?.id}  className="bg-white shadow-md py-6 px-3 w-full text-center mt-6"
                >
                {/* Infos autres participants à la list */}
                  <div className="w-full grid grid-cols-2 gap-4 my-4 items-center">
                    <Avatar className="h-20 w-20">
                      { competitor?.recipient?.googleImage && <AvatarImage src={competitor?.recipient?.googleImage}/> }
                      <AvatarFallback className="bg-blue-500 text-white text-3xl">
                        {competitor?.recipient?.firstname.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback> 
                    </Avatar>
                    { competitor &&  (<p className="text-lg break-words font-semibold text-slate-600">
                      {capitalize(competitor?.recipient?.username)}
                    </p>)}
                  </div>
                  {/* Infos supplémentaires */}
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <UserRound className="text-blue-500" />
                    {competitor && (<p className="text-lg text-slate-600 break-words font-semibold">
                      {capitalize(competitor?.recipient?.firstname)}
                    </p>)}
                </div>
                <div className="w-full grid grid-cols-2 gap-4 mt-2">
                  <MapPin className="text-blue-500" />
                  {competitor && (<p className="text-slate-600 break-words">
                    {capitalize(competitor?.recipient?.country)}
                  </p>)}
                </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <HandCoins className="text-blue-500" />
                    {competitor && (<p className="text-xl font-bold text-green-600">
                      {concernedList?.amount} {connected?.currency}
                    </p>)}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                      <Building2 className="text-blue-500" />
                      {competitor && (<p className="text-slate-600 break-words">
                      {capitalize(competitor?.recipient?.bio)}
                    </p>)}
                  </div>
                  { competitor?.recipient?.id === concernedList?.chosenRecipient && (
                  <div className="w-full grid grid-cols-2 gap-4 mt-4 text-slate-500">
                    <div>
                      <p className='text-start'>Choisi le:</p>
                    </div>
                    <div>
                      {concernedList?.recipientChosenAt &&(<p>{format(new Date(concernedList?.recipientChosenAt), DATE_FORMAT)}</p>)}
                    </div>
                  </div>)}
                  {/* validation du donator */}
                  { competitor?.recipient?.id === concernedList?.chosenRecipient && (
                  <div className="w-full grid grid-cols-2 gap-4 mt-4 text-slate-500">
                    <div>
                      <p className='text-start'>Don fait le:</p>
                    </div>
                    <div>
                      {concernedList?.donorConfirmedAt &&(<p>{format(new Date(concernedList?.donorConfirmedAt), DATE_FORMAT)}</p>)}
                    </div>
                  </div>)}
                <Separator className="my-4" />
                  {concernedList?.chosenRecipient === competitor?.recipient?.id ?(
                    <p className='text-xl font font-medium text-blue-500'>Destinataire</p>):(
                      <p className='text-xl font font-medium text-blue-500'>Participant</p>
                    )}
                </Card>
                ))}
            </div>
        </div>
      </div>
    )
}
//
export default HistoryDetails

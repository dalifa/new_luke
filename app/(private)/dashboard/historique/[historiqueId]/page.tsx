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
    const myHistorical = await prismadb.collectionParticipant.findFirst({
      where:{
        collectionId: params?.historiqueId,
        recipientValidation: true,
        participantId: connected?.id
      },
      include: {
        participant: true, // celui qui a donné
        recipient: true    // celui qui a reçu
      }
    })
    // on select les champs de la collecte concerné quand le recipient à validé 
    const historical = await prismadb.collectionParticipant.findMany({
      where: {
        collectionId: params?.historiqueId,
        recipientValidation: true,
        participantId: { not: connected?.id }
      },
      include: {
        participant: true, // celui qui a donné
        recipient: true    // celui qui a reçu
      }
    });    
    
    //
    //
    return (
      <div className='pt-2 h-ull flex items-center flex-col'>
        <div className='w-full lg:w-4/5 flex flex-col items-center gap-y-4 m-4 px-4'>
          <Card className='w-full flex flex-col p-4 gap-y-2 mb-2 text-center text-indigo-600 shadow-xl'>
            <p className='text-xl md:text-2xl'>Historique de la collecte</p>
          </Card>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4'>
            <Card className="bg-white shadow-md py-6 px-3 w-full text-center mt-6">
              {/* Infos Donateur connecté */}
              <div className="w-full grid grid-cols-2 gap-4 my-4 items-center">
                <Avatar className="h-20 w-20">
                  { myHistorical?.participant?.googleImage && (<AvatarImage src={myHistorical?.participant?.googleImage} />) }
                      <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                        {myHistorical?.participant?.firstname?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    { myHistorical?.participant &&  (<p className="text-lg break-words font-semibold text-slate-600">
                      {capitalize(myHistorical?.participant?.username)}
                    </p>)}
                  </div>
                  {/* Infos supplémentaires */}
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <UserRound className="text-indigo-600" />
                    {myHistorical?.participant && (<p className="text-lg text-slate-600 break-words font-semibold">
                      {capitalize(myHistorical?.participant?.firstname)}
                    </p>)}
                </div>
                <div className="w-full grid grid-cols-2 gap-4 mt-2">
                  <MapPin className="text-indigo-600" />
                  {myHistorical?.participant && (<p className="text-slate-600 break-words">
                    {capitalize(myHistorical?.participant?.country)}
                  </p>)}
                </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <HandCoins className="text-indigo-600" />
                    {myHistorical?.participant && (<p className="text-xl font-bold text-green-600">
                      {myHistorical?.concernedAmount} {connected?.currency}
                    </p>)}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <Building2 className="text-indigo-600"/>
                    {myHistorical?.participant && (<p className="text-slate-600 break-words">
                      {capitalize(myHistorical?.participant?.bio)}
                    </p>)}
                  </div>
                  
                  <div className="w-full grid grid-cols-2 gap-4 mt-4 text-slate-500">
                    <div>
                      <p className='text-start'>Validation reçu le:</p>
                    </div>
                    <div>
                      { myHistorical?.recipientValidationAt &&(<p>{format(new Date(myHistorical?.recipientValidationAt), DATE_FORMAT)}</p>)}
                    </div>
                  </div>
                  <Separator className="my-4"/>
                  <p className='text-xl font font-medium text-indigo-600'>Donateur</p>
            </Card>

            { historical.map((historic) => (
              <Card 
                key={historic?.id}  className="bg-white shadow-md py-6 px-3 w-full text-center mt-6"
              >
                {/* Infos autres participants à la list */}
                  <div className="w-full grid grid-cols-2 gap-4 my-4 items-center">
                    <Avatar className="h-20 w-20">
                      { historic?.participant?.googleImage && <AvatarImage src={historic?.participant?.googleImage}/> }
                      <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                        {historic?.participant?.firstname.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback> 
                    </Avatar>
                    { historic?.participant &&  (<p className="text-lg break-words font-semibold text-slate-600">
                      {capitalize(historic?.participant?.username)}
                    </p>)}
                  </div>
                  {/* Infos supplémentaires */}
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <UserRound className="text-indigo-600" />
                    {historic?.participant && (<p className="text-lg text-slate-600 break-words font-semibold">
                      {capitalize(historic?.participant?.firstname)}
                    </p>)}
                </div>
                <div className="w-full grid grid-cols-2 gap-4 mt-2">
                  <MapPin className="text-indigo-600" />
                  {historic?.participant && (<p className="text-slate-600 break-words">
                    {capitalize(historic?.participant?.country)}
                  </p>)}
                </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <HandCoins className="text-indigo-600" />
                    {historic?.participant && (<p className="text-xl font-bold text-green-600">
                      {historic?.concernedAmount} {connected?.currency}
                    </p>)}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-2">
                      <Building2 className="text-indigo-600" />
                      {historic?.participant && (<p className="text-slate-600 break-words">
                      {capitalize(historic?.participant?.bio)}
                    </p>)}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-4 mt-4 text-slate-500">
                    <div>
                      <p className='text-start'>Choisi le:</p>
                    </div>
                    <div>
                      {historic?.recipientChosenOn && (<p>{format(new Date(historic?.recipientChosenOn), DATE_FORMAT)}</p>)}
                    </div>
                  </div>
                  {/* validation du donator */}
                  <div className="w-full grid grid-cols-2 gap-4 mt-4 text-slate-500">
                    <div>
                      <p className='text-start'>Don fait le:</p>
                    </div>
                    <div>
                      {historic?.donorValidationAt && (<p>{format(new Date(historic?.donorValidationAt), DATE_FORMAT)}</p>)}
                    </div>
                  </div>
                <Separator className="my-4" />
                  {historic?.recipientId === connected?.id ?(
                    <p className='text-xl font font-medium text-indigo-600'>Destinataire</p>):(
                      <p className='text-xl font font-medium text-indigo-600'>Participant</p>
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

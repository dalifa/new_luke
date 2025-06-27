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
    // On select selon id ( = historiqueId ) de l'entrée du connecté dans la collecte 
    const myId = await prismadb.collectionParticipant.findFirst({
      where: { id: params?.historiqueId }
    })
    // on select les champs de la collecte concerné quand le recipient à validé 
    const historical = await prismadb.collectionParticipant.findMany({
      where: {
        collectionId: myId?.collectionId,
        // recipientValidation: true,
      },
      include: { 
        participant: true, // celui qui a donné
        recipient: true    // celui qui a reçu
      }
    });    
    //
    return (
      <div className='pt-2 h-ull flex items-center flex-col'>
        <div className='w-full lg:w-4/5 flex flex-col items-center gap-y-4 m-4 px-4'>
          <Card className='w-full flex flex-col p-4 gap-y-2 mb-2 text-center text-indigo-600 shadow-xl'>
            <p className='text-xl md:text-2xl'>Historique de la liste de {myId?.concernedAmount}{connected?.currency}</p>
          </Card>
          <Card className='w-full flex flex-col p-4 gap-y-2 mb-2 text-center text-indigo-600 shadow-xl'>
            <div className='grid grid-cols-2'>
              <div>Donateur</div>
              <div>Bénéficiaire</div>
            </div>
            { historical.map((historic) => (
              <div key={historic?.id}  className="grid grid-cols-2 gap-4">
                <div className="w-full flex flex-col items-center gap-y-2 border-b-2 pb-2">
                    <Avatar className="h-20 w-20">
                      { historic?.participant?.googleImage && <AvatarImage src={historic?.participant?.googleImage}/> }
                      <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                        {historic?.participant?.firstname.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback> 
                    </Avatar>
                    { historic?.participant &&  (<p className="text-lg break-words font-semibold text-slate-600">
                      {capitalize(historic?.participant?.username)}
                    </p>)}
                    
                      {historic?.donorValidationAt && (<p className='text-slate-400 text-xs'>{format(new Date(historic?.donorValidationAt), DATE_FORMAT)}</p>)}

                </div>
                  {/* son donataire*/}
                  <div className="w-full flex flex-col items-center gap-y-2 border-b-2 pb-2 ">
                    <Avatar className="h-20 w-20">
                      { historic?.recipient?.googleImage && <AvatarImage src={historic?.recipient?.googleImage}/> }
                      <AvatarFallback className="bg-indigo-600 text-white text-3xl">
                        {historic?.recipient?.firstname.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback> 
                    </Avatar>
                    { historic?.recipient &&  (<p className="text-lg break-words font-semibold text-slate-600">
                      {capitalize(historic?.recipient?.username)}
                    </p>)}
                    <div>
                      {historic?.recipientValidationAt && (<p className='text-slate-400 text-xs'>
                        {format(new Date(historic?.recipientValidationAt), DATE_FORMAT)}
                      </p>)}
                    </div>
                  </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    )
}
//
export default HistoryDetails

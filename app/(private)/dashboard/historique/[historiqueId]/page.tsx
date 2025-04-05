import { Card } from '@/components/ui/card'
import { CurrentProfile } from '@/hooks/own-current-user'
import { prismadb } from '@/lib/prismadb'
import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
// pour format date
import { format } from "date-fns"
// on crée une constance pour date
const DATE_FORMAT = "d MMM yyyy, HH:mm"

const HistoryDetails = async ({
    params
  }: {
    // historiqueId = le nom du fichier s'il est différent, ça ne marche pas
    params: { historiqueId: string }
  }) => {
    const connected = await CurrentProfile()
    // on select l'id de la list to bless concernée
    const concernedList = await prismadb.myListToBless.findFirst({
        where: { 
          id : params.historiqueId,
          chosenRecipient: connected?.id
        },
        include: {
          potentialRecipients: {
            include: {
              recipient: true, // Récupère les infos du bénéficiaire
            },
          },
        },
    })
    //
    return (
        <div className='pt-5 h-ull flex items-center flex-col'>
            <div className='w-full lg:w-4/5 flex flex-col items-center gap-y-4 m-4 px-4'>
                <Card className='w-full flex flex-col p-4 gap-y-2 mb-8 text-center text-slate-700 shadow-md shadow-blue-100'>
                  <p className='text-lg md:text-xl'>Historique de </p>
                </Card>
                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4'>
                 a
                </div>
            </div>
        </div>
    )
}

export default HistoryDetails

/* */
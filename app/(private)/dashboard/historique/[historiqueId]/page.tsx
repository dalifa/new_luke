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
    // on select le id de la collecte concernée
    const concernedCollection = await prismadb.collection.findFirst({
        where: { id : params.historiqueId }
    })
    // on select les entrées de chaque participant dans  CollectionResult
    const results = await prismadb.collectionResult.findMany({
        where: { collectionId: concernedCollection?.id }
    })
    // on select l'entrée du connecté pour avoir la date
    const date = await prismadb.collectionResult.findFirst({
      where: { 
        donatorProfileId: connected?.id,
        collectionId: concernedCollection?.id
      }
    })
    // on select tous les profiles de la table Profile
    const profiles = await prismadb.profile.findMany()
    // on select tous les profiles de la table User
    const users = await prismadb.user.findMany()
    

    return (
        <div className='pt-14 h-ull flex items-center flex-col'>
            <div className='w-full lg:w-4/5 flex flex-col items-center gap-y-4 m-4 px-4'>
                <Card className='w-full flex flex-col p-4 gap-y-2 mb-8 text-center text-slate-700 shadow-md shadow-blue-100'>
                  <p className='text-lg md:text-xl'>Historique du Tripl de {date?.amount}{date?.currency}</p>
                  <p className='text-sm'>{date && ( <span>&nbsp;du: {format(new Date(date?.createdAt), DATE_FORMAT)}</span>)}</p>
                </Card>
                <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4'>
                    {/*<ScrollArea className='h-80'>*/}
                    {
                        results.map((result) => (
                            <Card key={result.id} className='grid grid-cols-3 p-2 gap-1 shadow-lg shadow-blue-100'>
                              <div className=''>
                              {
                                profiles.map((profile) => (
                                  <div key={profile.id}>
                                    { result.donatorProfileId === profile.id && (
                                      <div className='grid grid-cols-1 gap-y-1'>
                                        {
                                          users.map((user) => (
                                            <div key={user.id} className='flex flex-col items-center'>
                                              { profile.hashedEmail === user.hashedEmail && (
                                                  <Avatar className='h-10 w-10 border-white border-2'>
                                                    <AvatarImage src={user.image || ""} />
                                                  </Avatar>
                                                )
                                              }
                                            </div>
                                          ))
                                        }
                                        <div className=''>
                                          <p className='text-center font-medium text-xs md:text-sm'>{ profile.username }</p>
                                        </div>
                                      </div>)}
                                  </div>))
                              }
                              </div>

                              <div className='flex items-center text-xs md:text-sm justify-center font-medium flex-col text-slate-700'>
                                <p>a désigné avec joie</p>
                              </div>

                              <div className='flex items-center justify-center'>
                              {
                              profiles.map((profile) => (
                                <div key={profile.id}>
                                  { result.recipientProfileId === profile.id && (
                                    <div className=' flex items-center justify-center flex-col'>
                                      {
                                        users.map((user) => (
                                          <div key={user.id}>
                                            { profile.hashedEmail === user.hashedEmail && (
                                              <Avatar className='h-10 w-10 border-white border-2'>
                                                <AvatarImage src={user.image || ""} />
                                              </Avatar>
                                            )}
                                          </div>
                                        ))
                                      }
                                      <span className='font-medium text-xs md:text-sm'>{ profile.username }</span>
                                    </div>)}
                                </div>))
                              }
                              </div>
                            </Card>
                        ))
                    }
                    {/*</ScrollArea>*/}
                </div>
            </div>
        </div>
    )
}

export default HistoryDetails

/* */
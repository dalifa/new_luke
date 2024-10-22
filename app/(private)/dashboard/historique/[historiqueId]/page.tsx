import { Card } from '@/components/ui/card'
import { currentUserInfos } from '@/hooks/own-current-user'
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
    const connectedProfile = await currentUserInfos()
    // on select le ownId de la collecte concernée
    const concernedCollection = await prismadb.collection.findFirst({
        where: { id : params.historiqueId }
    })
    // on select la collecte dans  CollectionResult
    const results = await prismadb.collectionResult.findMany({
        where: { collectionOwnId: concernedCollection?.ownId }
    })
    // pour avoir la date
    const date = await prismadb.collectionResult.findFirst({
      where: { 
        donatorcodepin: connectedProfile?.usercodepin,
        collectionOwnId: concernedCollection?.ownId
      }
    })
    // on select tous les profiles de la table Profile
    const profiles = await prismadb.profile.findMany()
    // on select tous les profiles de la table Profile
    const users = await prismadb.user.findMany()
    

    return (
        <div className='pt-14 h-ull flex items-center flex-col'>
            <div className='w-full lg:w-4/5 flex flex-col items-center gap-y-4 m-4 px-4'>
                <Card className='w-full p-4 mb-8 text-center text-slate-700 text-sm lg:text-md shadow-md shadow-blue-100'>
                    Dans votre collecte {concernedCollection?.collectionType} n° {concernedCollection?.ownId} de {concernedCollection?.amount}
                    {concernedCollection?.currency}
                {/*  du:  <span>{format(new Date(date?.createdAt), DATE_FORMAT)}</span> */}
                    
                </Card>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                    {/*<ScrollArea className='h-80'>*/}
                    {
                        results.map((result) => (
                            <Card key={result.id} className='grid grid-cols-3 p-1 gap-1 shadow-lg shadow-blue-100'>
                              <div className=''>
                              {
                                profiles.map((profile) => (
                                  <div key={profile.id}>
                                    { result.donatorcodepin === profile.usercodepin && (
                                      <div className='flex items-center justify-start flex-col'>
                                        {
                                          users.map((user) => (
                                            <div key={user.id} className=''>
                                                    { profile.googleEmail === user.email && (
                                                      <Avatar className='h-10 w-10 border-white border-2'>
                                                        <AvatarImage src={user.image || ""} />
                                                      </Avatar>
                                                    )}
                                            </div>
                                            ))
                                        }
                                        <p className='font-medium text-xs md:text-sm'>{ profile.username }</p>
                                      </div>)}
                                  </div>))
                              }
                              </div>

                              <div className='flex items-center text-xs md:text-sm justify-center font-medium flex-col text-slate-700'>
                                <p>
                                  {
                                    concernedCollection?.collectionType === "totality" ? (
                                      <span>a désigné</span>
                                    ):(
                                      <span>a donné</span>
                                    )
                                  }
                                </p>
                                <span>avec joie {concernedCollection?.collectionType === "snippets" && (<> à </>)}</span>
                              </div>

                              <div className='flex items-center justify-center'>
                              {
                              profiles.map((profile) => (
                                <div key={profile.id}>
                                  { result.recipientcodepin === profile.usercodepin && (
                                    <div className=' flex items-center justify-center flex-col'>
                                      {
                                        users.map((user) => (
                                          <div key={user.id}>
                                            { profile.googleEmail === user.email && (
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


/*
{
                                    profiles.map((profile) => (
                                      <div key={profile.id} className='flex'>
                                        { result.donatorLukecode === profile.lukecode && (
                                          <div className='grid grid-cols-3'>
                                            <div>
                                              {
                                                users.map((user) => (
                                                  <div key={user.id}>
                                                    { profile.googleEmail === user.email && (
                                                      <Avatar className='h-8 w-8 border-white border-2'>
                                                        <AvatarImage src={user.image || ""} />
                                                      </Avatar>
                                                    )}
                                                  </div>
                                                ))
                                              }
                                              <span>{ profile.username }</span>
                                            </div>

                                            <div className=' flex items-center justify-center'>
                                              <p className='text-lg'> a donné à </p>
                                            </div>

                                            <div>
                                              {
                                                result.recipientLukecode === profile.lukecode && (
                                                <div>
                                                  {
                                                    users.map((user) => (
                                                      <div key={user.id}>
                                                        { profile.googleEmail === user.email && (
                                                          <Avatar className='h-8 w-8 border-white border-2'>
                                                            <AvatarImage src={user.image || ""} />
                                                          </Avatar>
                                                        )}
                                                      </div>
                                                    ))
                                                  }
                                                  <p>{ profile.username }</p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))
                                }
                            </Card>
                        ))
                    }
*/
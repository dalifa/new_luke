//
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { GrMoney } from "react-icons/gr";
import Link from 'next/link';
import { capitalize, currentUserInfos } from '@/hooks/own-current-user';
import { CircleUserRound } from 'lucide-react';
//
const Collection = async ({
    params
  }:{
    // collectionId = le nom du fichier s'il est différent, ça ne marche pas 
    params: { collectionId: string }
  }) => {
    const connectedProfile = await currentUserInfos()
    // on selecte la collect selon params
    const theParams = await prismadb.collection.findFirst({
        where: { id: params.collectionId}
    })
    // on select tous les participant à cette collecte
    const allParticipants = await prismadb.collection.findMany({
      where: {
        ownId: theParams?.ownId,
        amount: theParams?.amount,
        currency: theParams?.currency,
        collectionType: theParams?.collectionType,
     }
    })
    // connected Participant collection datas
    const connectedParticipant = await prismadb.collection.findFirst({
      where: {
        ownId: theParams?.ownId,
        amount: theParams?.amount,
        currency: theParams?.currency,
        collectionType: theParams?.collectionType,
        usercodepin: connectedProfile?.usercodepin
      }
    })
    // on select tous les profiles 
    const profileDatas = await prismadb.profile.findMany()
    // on select tous les profiles
    const userDatas = await prismadb.user.findMany()
    // #####
    return (
      <div className='h-ull flex items-center justify-center flex-col pt-2 lg:pt-10 gap-10'>
        <div className='w-4/5 lg:w-2/5 p-3 border rounded text-blue-500 text-center'>
          <p className='text-slate-600 text-center text-md lg:text-lg'>
            Participants à votre collecte n° {theParams?.ownId} de {theParams?.amount}{theParams?.currency}
          </p>
        </div>
        <div className='w-4/5'>
          {
            profileDatas && allParticipants && (
              <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4'>
                {
                  allParticipants.map((allParticipant:any) => (
                    <Card key={allParticipant.id} className='p-4 bg-white text-slate-600 shadow-lg shadow-blue-100'>
                      {
                        profileDatas.map((profileData) => (
                          <div key={profileData.id}>
                            {
                              allParticipant.usercodepin == profileData.usercodepin && (
                                <div className='grid grid-cols-1 gap-y-2'>
                                  <div className='grid grid-cols-1 gap-x-2'>
                                    <div className='flex flex-row items-center mb-2 gap-x-3'>
                                      {
                                        userDatas && (
                                          <div>
                                            {
                                              userDatas.map((userData) => (
                                                <div key={userData.id}>
                                                  {
                                                    userData.email == profileData.googleEmail && (
                                                      <Avatar className='h-16 w-16 md:h-24 md:w-24 border-white border-2'>
                                                        <AvatarImage src={userData.image || ""} />
                                                        <AvatarFallback className="bg-white">
                                                          <CircleUserRound className="text-blue-500 h-16 w-16 lg:h-24 lg:w-24" />
                                                        </AvatarFallback>
                                                      </Avatar>
                                                    )
                                                  }
                                                </div>
                                              ))
                                            }
                                          </div>
                                        )
                                      }
                                      {/**/}
                                      <p className='text-md lg:text-xl font-semibold'> {capitalize(profileData.username)} </p>
                                    </div>
                                    <div className='flex flex-col items-start gap-y-1 pt-1'>
                                      <p className='text-xs text-slate-500 mb-1'> {capitalize(profileData.city)} </p>
                                      <p className='text-xs text-slate-500'> {capitalize(profileData.bio)} azert azert azert azert azertyuiop</p>
                                    </div> 
                                  </div>
                                  <div className='flex items-end justify-end border-2 border-green-500'>
                                    {
                                      profileData.usercodepin !== connectedProfile?.usercodepin && (
                                        <div>
                                          {
                                            theParams?.group === theParams?.groupStatus ? (
                                            <>
                                              {
                                                allParticipant.isOnlyDonator === false ? (
                                                  <>
                                                    {
                                                      connectedParticipant?.hasGive !== true ? (
                                                        <Link href={`/dashboard/${params.collectionId}/${allParticipant.id}`}>
                                                          <Button variant={"blue"} size={"sm"} className='rounded-md text-white'>    
                                                            Donner <GrMoney className="h-5 w-5 cursor-pointer ml-2"/>
                                                          </Button>
                                                        </Link>
                                                      ):(
                                                          <Link href={"/dashboard/historique"}>
                                                            <p className='mt-6 text-md'>Merci de tout coeur. 🙏</p> 
                                                          </Link>
                                                        )
                                                    }
                                                  </>
                                                ):(
                                                    <p>Je veux juste donner</p>
                                                  )
                                              }
                                            </>
                                            ):(
                                              <> 
                                                <p className='mt-6 text-md'>
                                                  <span className='text-green-700'>{theParams?.groupStatus } {/*espape utile*/}</span>
                                                    participants / {theParams?.group}
                                                </p>
                                              </>
                                            )
                                          }
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                              )
                            }
                          </div>
                        ))
                      }
                    </Card>
                  ))
                }
              </div>
              )
            }
          </div>
        </div>
    )
}

export default Collection
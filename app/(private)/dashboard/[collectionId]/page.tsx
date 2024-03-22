//
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { GrMoney } from "react-icons/gr";
import { FaCircleUser } from "react-icons/fa6";
import Link from 'next/link';
import { currentUserInfos } from '@/hooks/own-current-user';
import { Gift } from 'lucide-react';
import UpdateObjectToFinance from '@/components/dashboard/object-to-finance';
import AddObjectToFinance from '@/components/dashboard/object-to-finance';

const Collection = async ({
    params
  }: {
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
      //
      const allmemberObjects = await prismadb.myObject.findMany({})

      const allObjets = await prismadb.toFinance.findMany({})
    // #####

    return (
        <div className='h-full w-full flex items-center flex-col'>
            <div className='w-full md:w-4/5 flex flex-col items-center gap-y-5 px-5'>
                <Card className='flex flex-col items-center w-full p-5 text-sm md:text-md bg-white font-semibold shadow-md shadow-slate-300'>
                    <p className='text-slate-600 text-justify'>
                        Participants à votre collecte n° {theParams?.ownId} de {theParams?.amount}{theParams?.currency}
                    </p>
                </Card>
                <div className='w-full'>
                {
                    profileDatas && allParticipants && (
                        <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3'>
                        {
                            allParticipants.map((allParticipant:any) => (
                                <Card key={allParticipant.id} className='p-2 bg-white text-slate-500 shadow-sm shadow-slate-300'>
                                    {
                                        profileDatas.map((profileData) => (
                                            <div key={profileData.id}>
                                                {allParticipant.usercodepin == profileData.usercodepin && (
                                                    <div className='flex flex-col gap-y-4'>
                                                        <div className='flex flex-row gap-x-5'>
                                                            {
                                                                userDatas && (
                                                                    // en prod
                                                                    <div>
                                                                        {
                                                                            userDatas.map((userData) => (
                                                                                <div key={userData.id}>
                                                                                    {userData.email == profileData.googleEmail && (
                                                                                        <Avatar className='h-12 md:h-14 w-12 md:w-14 border-white border-2'>
                                                                                        <AvatarImage src={userData.image || ""} />
                                                                                        <AvatarFallback className="bg-white">
                                                                                            <FaCircleUser className="text-sky-500" />
                                                                                        </AvatarFallback>
                                                                                    </Avatar>
                                                                                    )}
                                                                                </div>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                )
                                                            }
                                                            <div className='flex flex-col items-start gap-y-1'>
                                                                <p className='text-sm md:text-md font-semibold'> {profileData.username}</p>
                                                                <p className='text-xs text-slate-500'>De: {profileData.city}</p>
                                                            </div> 
                                                        </div>
                                                        <div className='grid grid-cols-2'>
                                                            <div className='flex flex-col gap-y-1'>
                                                                <div>
                                                                    <p className='text-xs font-medium'>Objet à faire financer</p>
                                                                </div>
                                                                <div className='flex flex-row items-center gap-1'> 
                                                                    <Gift/>
                                                                    {
                                                                        allmemberObjects.map((allmemberObject)=>(
                                                                            <div key={allmemberObject.id}>
                                                                                {
                                                                                    allmemberObject.usercodepin === profileData.usercodepin && (
                                                                                        <div>
                                                                                            {
                                                                                                allObjets.map((allObjet) => (
                                                                                                    <div key={allObjet.id}>
                                                                                                        {
                                                                                                            allObjet.id === allmemberObject.objectToFinanceId && (
                                                                                                                <p className='text-xs'>{ allObjet.objectName }</p>
                                                                                                            )
                                                                                                        }
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='flex items-end justify-end'>
                                                            {
                                                                profileData.usercodepin !== connectedProfile?.usercodepin && (
                                                                    <div>
                                                                    {
                                                                        theParams?.group === theParams?.groupStatus ? (
                                                                            <>
                                                                            {
                                                                                connectedParticipant?.hasGive !== true ? (
                                                                                    <Link href={`/dashboard/${params.collectionId}/${allParticipant.id}`}>
                                                                                        <Button variant={"blue"} className='rounded-lg text-white'>    
                                                                                           Donner <GrMoney className="h-5 w-5 cursor-pointer ml-2"/>
                                                                                        </Button>
                                                                                    </Link>
                                                                                ):(
                                                                                    <Link href={"/dashboard/historique"}>
                                                                                        <p className='mt-6 text-xs'>Merci de tout coeur. 🙏</p> 
                                                                                    </Link>
                                                                                )
                                                                            }
                                                                            </>
                                                                        ):(
                                                                            <>
                                                                            <p className='mt-6 text-xs'>
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
                                                    </div>
                                                )}
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
        </div>
    )
}

export default Collection

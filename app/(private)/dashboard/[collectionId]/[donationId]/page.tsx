import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { FaCircleUser } from "react-icons/fa6";
import BackCancel from '@/components/dashboard/action-in-collection/backCancelled';
import { useFormStatus } from 'react-dom' 
import { ConfirmGiveButton } from '@/components/dashboard/action-in-collection/confirm-give-button';
import { donationAmountAction } from '@/actions/donation/donationAmount';
import { currentUserInfos } from '@/hooks/own-current-user';

const Donation = async ({
  params
}: {
  // donationId = le nom du fichier s'il est différent, ça ne marche pas  
  params: { donationId: string }
  }) => {
    const connectedProfile = await currentUserInfos()
    // on selecte la collect selon params
    const theParams = await prismadb.collection.findFirst({
      where: { id: params.donationId} // ceci est l'id du recipient dans collection
    })
    //
    //const userDatas = await prismadb.user.findMany() ?

    // ## Donation actions ##
    const myRecipientId = params.donationId;
    const donationToRecipientId = donationAmountAction.bind(null, myRecipientId);
    // ## ---------------- ##
    // on verifie si le connecté, le donateur est dans cette collecte et n'a pas déjà donné
    const connectedInSameCollection = await prismadb.collection.count({
      where: {
        ownId: theParams?.ownId,  // le ownId est le même pour tous les participants
        amount: theParams?.amount,  // important
        currency: theParams?.currency,  // important
        collectionType: theParams?.collectionType, // important
        usercodepin: connectedProfile?.usercodepin
      }
    })
    //
    const connectedHasGive = await prismadb.collection.findFirst({
      where: {
        ownId: theParams?.ownId,  // le ownId est le même pour tous les participants
        amount: theParams?.amount,  // important
        currency: theParams?.currency,  // important
        collectionType: theParams?.collectionType, // important
        usercodepin: connectedProfile?.usercodepin
      }
    })
    // tous les profile
    const profiles = await prismadb.profile.findMany()

  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <div className='flex w-full p-4 md:w-3/5 items-center justify-center flex-col'>
        <Card className='flex flex-col w-full mt-0 md:mt-20 p-8 bg-white text-center items-center shadow-md'>
          <p className='text-blue-500 text-lg lg:text-xl font-semibold'>Confirmation de don</p>
          <div className='flex flex-col gap-y-1 text-center text-sm mb-2 py-5 text-slate-500'>
            <p>Confirmez-vous le don libre de</p> 
              {
                profiles.map((profile) => (
                  <div key={profile.id} className='flex flex-col text-center space-y-2'>
                    {
                      profile.googleEmail === theParams?.email && (
                        <>
                          <p className='text-slate-500'>
                            <span className='font-medium text-md'>{theParams?.amount}{theParams?.currency} </span>
                            à <span className='font-medium text-md'>{profile.username}</span>
                          </p>
                          <p className='text-xs'>de { profile.city}</p>
                          <p>dans une collecte {theParams?.collectionType} ?</p>
                        </>
                      )
                    }
                  </div>
                )) 
              }
          </div>
            <div className='grid grid-cols-2 gap-x-4'>
              <div>
                <BackCancel/>
              </div>
              <div>
                <form action={donationToRecipientId} className='flex flex-col gap-y-5'>          
                  <div>
                    {
                      connectedInSameCollection === 1 && connectedHasGive?.hasGive === false && (
                        <ConfirmGiveButton/>
                      )
                    }
                  </div>
                </form>
              </div>
            </div>
        </Card> 
      </div>
    </div>
  )
}

export default Donation
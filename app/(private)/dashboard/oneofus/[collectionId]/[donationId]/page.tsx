
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import BackCancel from '@/components/dashboard/action-in-collection/backCancelled'; 
import { ConfirmGiveButton } from '@/components/dashboard/action-in-collection/confirm-give-button';
import { donationAmountAction } from '@/actions/oneofus/donationAmount';
import { capitalize, currentUserInfos } from '@/hooks/own-current-user';

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
      <div className='flex w-full p-4 md:w-3/5 lg:w-2/5 items-center justify-center flex-col'>
        <Card className='flex flex-col w-full mt-[20%] p-8 bg-white text-center items-center shadow-md shadow-red-200'>
          <p className='text-red-800 text-lg md:text-xl font-semibold'>Confirmation de don</p>
          <div className='flex flex-col gap-y-1 text-center text-md md:text-lg mb-2 py-5 text-slate-500'>
            <p>Vous shouhaitez que</p> 
              {
                profiles.map((profile) => (
                  <div key={profile.id} className='flex flex-col text-center space-y-2 text-md md:text-lg'>
                    {
                      profile.googleEmail === theParams?.googleEmail && (
                        <>
                          <p className='font-semibold'>
                            {capitalize(profile.username)}
                          </p>
                          <p> 
                            reçoive le Tripl de {theParams?.amount}€
                          </p>
                        </>
                      )
                    }
                  </div>
                )) 
              }
          </div>
          <div className='grid grid-cols-2 gap-x-4'>
            <div className='w-full'>
              <BackCancel/>
            </div>
            <form action={donationToRecipientId}>  
              {
                connectedInSameCollection === 1 && connectedHasGive?.hasGive === false && (
                  <ConfirmGiveButton/>
                )
              }
            </form>
          </div>
        </Card> 
      </div>
    </div>
  )
}

export default Donation
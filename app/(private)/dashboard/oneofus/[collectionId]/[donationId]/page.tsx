
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import BackCancel from '@/components/dashboard/action-in-collection/backCancelled'; 
import { ConfirmGiveButton } from '@/components/dashboard/action-in-collection/oneofus/confirm-give-button';
import { donationInOneofusAction } from '@/actions/oneofus/donationAmount';
import { capitalize, currentUserInfos } from '@/hooks/own-current-user';

const Donation = async ({
  params
}: {
  // donationId = le nom du fichier s'il est différent, ça ne marche pas  
  params: { donationId: string } 
  }) => {
  //const connected = await currentUserInfos()
  // ##4 test##
  const connectedtestor = await prismadb.currentProfileForTest.findFirst()
  //
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: connectedtestor?.usercodepin}
  })
  // ### AND 4 TEST ####
    // on select la collecte concerné sur le base de l'id du donataire
    const doneeIncollection =  await prismadb.collectionParticipant.findFirst({
      where: { id: params?.donationId }
    })
    // on selecte le profile du donataire
    const doneeProfile = await prismadb.profile.findFirst({
      where: { id: doneeIncollection?.profileId } // ceci est l'id du recipient dans profile
    })
    const collectionData = await prismadb.collection.findFirst({
      where: { id: doneeIncollection?.collectionId }
    })
    // ## Donation actions ##
    const myRecipientId = params.donationId; // == profile Id of donee
    const donationToRecipientId = donationInOneofusAction.bind(null, myRecipientId);
    // ## ---------------- ##
    // on verifie si le connecté, le donateur est dans cette collecte et n'a pas déjà donné
    const connectedInSameCollection = await prismadb.collectionParticipant.count({
      where: {
        collectionId: collectionData?.id,  // le collectionId est le même pour tous les participants
        profileId: connected?.id // le connecté = donateur
      }
    })
    // on verifie si le connecté a déjà ou pas donné dans cette collecte
    const connectedHasGive = await prismadb.collectionParticipant.findFirst({
      where: {
        collectionId: collectionData?.id,
        profileId: connected?.id
      }
    })
    //
    const theJackpot = (collectionData && collectionData?.amount * collectionData?.group)
    //

  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <div className='flex w-full p-4 md:w-3/5 lg:w-2/5 items-center justify-center flex-col'>
        <Card className='flex flex-col w-full mt-[20%] p-8 bg-white text-center items-center shadow-md shadow-violet-200'>
          <p className='text-violet-600 text-lg md:text-xl font-semibold'>Confirmation de don</p>
          <div className='flex flex-col gap-y-1 text-center text-md md:text-lg mb-2 py-5 text-slate-500'>
            <p>Vous shouhaitez que</p> 
            <div className='flex flex-col text-center space-y-2 text-md md:text-lg'>
              <p className='font-semibold'>{doneeProfile && (capitalize(doneeProfile?.username)) }</p>
              <p> reçoive la cagnotte de <span className='font-semibold'>{theJackpot}</span>{collectionData?.currency} </p>
            </div>
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
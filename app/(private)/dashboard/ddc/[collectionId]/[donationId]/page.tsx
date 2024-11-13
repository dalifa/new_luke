
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import BackCancel from '@/components/dashboard/action-in-collection/backCancelled'; 
import { capitalize, currentUserInfos } from '@/hooks/own-current-user';
import { donationAmountAction } from '@/actions/ddc/donationAmount';
import { ConfirmGiveButton } from '@/components/dashboard/action-in-collection/ddc/confirm-give-button';

const Donation = async ({
  params
}: {
  // donationId = le nom du fichier s'il est différent, ça ne marche pas  
  params: { donationId: string } 
  }) => {
    // const connectedProfile = await currentUserInfos()
    // ##4 test##
  const currenttestor = await prismadb.currentProfileForTest.findFirst()
  // ##4 test##
  const connected4test = await prismadb.profile.findFirst({
    where: { usercodepin: currenttestor?.usercodepin}
  })

    // On selecte la collect selon params (params c'est id du recipient dans collectionParticipant)
    const myRecipientInCollection = await prismadb.collectionParticipant.findFirst({
      where: {
        id: params?.donationId
      },
      include: { profile: true },
    })
    //
    // On vérifie si le connecté est dans la même collecte que le recipient choisi
    const inSameCollectionCount = await prismadb.collectionParticipant.count({
      where: {
        collectionId: myRecipientInCollection?.collectionId,
        profileId: connected4test?.id,
        hasGive: false
      }
    })
    //
    const amountToGive = await prismadb.collectionParticipant.findFirst({
      where: { id: params?.donationId},
      include: { collection: true }
    })
    // ## Donation actions ##
    const myRecipientId = params.donationId;
    const donationToRecipientId = donationAmountAction.bind(null, myRecipientId);
    // ## ---------------- ##
    const one = 1

  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <div className='flex w-full p-4 md:w-3/5 lg:w-2/5 items-center justify-center flex-col'>
        <Card className='flex flex-col w-full mt-[20%] p-8 bg-white text-center items-center shadow-md shadow-violet-200'>
          <p className='text-violet-600 text-lg md:text-xl font-semibold'>Confirmation de don</p>
          <div className='flex flex-col gap-y-1 text-center text-md md:text-lg mb-2 py-5 text-slate-500'>
            <p>Vous donnez avec joie </p> 
            <p> {amountToGive?.collection?.amount}{amountToGive?.collection?.currency}&nbsp; à  &nbsp;
            {
              myRecipientInCollection?.profile && (
              <span className='font-semibold'>
                {capitalize(myRecipientInCollection?.profile?.username)}
              </span>)
            }
            </p>
          </div>
          <div className='grid grid-cols-2 gap-x-4'>
            <div className='w-full'>
              <BackCancel/>
            </div>
            <form action={donationToRecipientId}>  
            {
              amountToGive?.collection?.isGroupComplete === true && amountToGive?.collection?.isCollectionClosed === false && (
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
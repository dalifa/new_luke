
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { capitalize, CurrentProfile, } from '@/hooks/own-current-user';
import { donationAmountAction } from '@/actions/tripl/donationAmount';
import { ConfirmTriplGiveButton } from '@/components/dashboard/action-in-collection/tripl/confirm-give-button';
import BackButton from '@/components/dashboard/enter-in-collection/tripl/backButton';

const Donation = async ({
  params
}: {
  // donationId = le nom du fichier s'il est différent, ça ne marche pas  
  params: { donationId: string } 
  }) => {
    const connected = await CurrentProfile()
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
        profileId: connected?.id,
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
    //const one = 1

  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <div className='flex w-full p-4 md:w-3/5 lg:w-2/5 items-center justify-center flex-col'>
        <Card className='flex flex-col w-full mt-[20%] p-8 bg-white text-center items-center shadow-md shadow-blue-300'>
          <p className='text-blue-500 text-lg md:text-xl font-semibold'>Confirmation de don</p>
          <div className='flex flex-col gap-y-1 text-center text-md md:text-lg mb-2 py-5 text-slate-500'>
            <p>Vous shouhaitez que</p> 
            {
              myRecipientInCollection?.profile &&(
              <p className='font-semibold'>
                {capitalize(myRecipientInCollection?.profile?.username)}
              </p>)
            }
            <p> reçoive le Tripl de {amountToGive?.collection?.amount}{amountToGive?.collection?.currency}</p>
          </div>
          <div className='grid grid-cols-2 gap-x-4'>
            <div className='w-full'>
              <BackButton/>
            </div>
            <form action={donationToRecipientId}>  
            {
              inSameCollectionCount === 1 && amountToGive?.collection?.isGroupComplete === true && amountToGive?.collection?.isCollectionClosed === false && (
                <ConfirmTriplGiveButton/>
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
//
import SearchFriendForm from '@/components/dashboard/searchFriendForm';
import { CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
//
const Parrainage = async () => {
  const connected = await CurrentProfile()
  const searchedPerson = await prismadb.mySearch.findFirst({
    where: { profileId: connected?.id }
  })
  // on select le profile de la personne recherché
  const searchedProfile = await prismadb.profile.findFirst({
    where: { 
      hashedPhone: searchedPerson?.searchedPhone,
      currency: connected?.currency, 
      country: connected?.country
    }
  })
  // ON SELECT SON PLUS GRAND DON EFFECTUE
  const maxDonation = await prismadb.collectionParticipant.aggregate({
    where: { 
      participantId: searchedProfile?.id,
      recipientValidation: true
    },
    _max: {
      concernedAmount: true,
    },
  });
  const highestAmount = maxDonation._max.concernedAmount;
  //
  // ON SELECT SON PLUS GRAND DON REÇU
  const maxReception = await prismadb.collectionParticipant.aggregate({
    where: { 
      recipientId: searchedProfile?.id,
      recipientValidation: true
    },
    _max: {
      concernedAmount: true,
    },
  });
  
  const highestAmountReceived = maxReception._max.concernedAmount;
  
  //   
  return (
    <div className='h-full pt-10 lg:pt-20 flex items-center justify-center flex-col lg:px-4 bg-indigo-600'>
      <div className='flex flex-col items-center justify-between py-10 px-4 lg:px-10 text-lg lg:text-2xl h-4/5 lg:h-4/5 w-4/5 lg:w-3/5 rounded text-center bg-white shadow-xl'>
        <p className='text-indigo-600 text-center text-xl mb-5'>
          Retrouver un frère ou une soeur
        </p>
        <div className='w-full lg:w-3/5 rounded border-2 border-slate-500 mb-4 py-4 px-2'>
          {
            searchedPerson && searchedProfile ? (
              <div className='flex flex-col items-start space-y-2'>
                <p>Prénom: &nbsp;{searchedProfile?.firstname}</p>
                <p>De: &nbsp;{searchedProfile?.city}</p>
                { highestAmount && highestAmount > 0 && (
                  <p>Plus grand don éffectué: &nbsp;{highestAmount}{connected?.currency}</p>
                )}
                { highestAmountReceived && highestAmountReceived > 0 && (
                  <p>Plus grand don reçu: &nbsp;{highestAmountReceived}{connected?.currency}</p>
                )}
              </div>
            ):(
              <p>Aucune personne retrouvée 😉</p>
            )
          }
        </div>
        <SearchFriendForm/>
      </div>
    </div>
  )
}
//
export default Parrainage

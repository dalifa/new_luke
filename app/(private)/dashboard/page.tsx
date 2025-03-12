//
import { auth } from '@/auth';
import { CollectionsInProgress } from '@/components/dashboard/collections-in-progress';
import { Counters } from '@/components/dashboard/counters';
import { MyOpenTripl } from '@/components/dashboard/enter-in-collection/tripl/my-open-tripl';
import { TriplCollectionEnter } from '@/components/dashboard/enter-in-collection/tripl/tripl-collection-enter';
//
import { prismadb } from '@/lib/prismadb';
import { encrypt, hashed } from '@/lib/utils';
import { redirect } from 'next/navigation';
//
const Dashboard = async () => {
  // la redirection pour les non connectés est faite depuis le fichier middleware 
  const session = await auth();
  const currentUser = await prismadb.user.findFirst({
    where: { email: session?.user?.email}
  })
  // Si le mail hashé du connecté n'est pas dans la table Profile
  // nbre de profile présent dans la table profile pour produire son CODEPIN
  const profileNbr = await prismadb.profile.count()
  //
  // SERVER ACTION POUR CRÉER LE PROFIL
  async function create() {
    "use server";
    //
    if(session?.user?.email && session?.user?.name)
    {
      // le vrai nom venu de google hashé
      const nameEncrypted = encrypt(session?.user?.name) // on encrypt le name en cas de pyratage
      // provisoirement on crypt le faux n° 0600000000 
      const fakePhoneEncrypted = encrypt("0600000000")
      // provisoirement on hash le faux n° 0600000000
      const fakePhoneHashed = hashed("0600000000")
      // on entre l'email hashé dans la table USER
      await prismadb.user.updateMany({
        where: { email: session?.user?.email },
        data: { 
          name: nameEncrypted,
          hashedPhone: fakePhoneHashed
        }
      })
      // nom encrypted
      const lastnameEncrypted = encrypt("nom") 
      // ON CRÉE SON PROFIL À MINIMA QU'IL UPDATERA ENSUITE
      await prismadb.profile.create({
        data: { 
          codepin: profileNbr + 1000,
          googleImage: currentUser?.image,
          googleEmail: session?.user?.email,
          encryptedLastname: lastnameEncrypted,
          hashedPhone: fakePhoneHashed,
          encryptedPhone: fakePhoneEncrypted,
        },
      });
    }
  }
  // Appelle la Server Action pour créer le profil
  if(!currentUser?.hashedPhone) // ou if (!profile)
  {
    await create(); 
  }
  //
  // Vérifie si le profil existe dans la table profile
  const profile = await prismadb.profile.findFirst({
    where: { googleEmail: currentUser?.email },
  });
  // si son pseudo === pseudo donc il n'a pas encore updaté son profile
  if(profile && profile?.username === "pseudo" || profile?.firstname === "prénom" || profile?.city === "ville" || profile?.country === "pays")
  {
    return redirect(`/dashboard/profile/${profile?.id}`)
  }
  // 
  return (
    <div className='lg:pt-5 h-ull flex items-center flex-col bg-white/90'>
      <div className='w-full md:w-4/5 flex flex-col items-center m-4 gap-y-4 px-5 lg:pb-20'>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
          {/* crédit et cagnotte */}
            <Counters/> 
          {/* collectes en cours sur le site */}
            <CollectionsInProgress/> 
          {/* pour entrer dans un tripl */}
            <TriplCollectionEnter/>
          {/* my open tripl */}  
            <MyOpenTripl/>       
        </div> 
      </div>
    </div>
  )
}
//
export default Dashboard

//
import { auth } from '@/auth';
import { Counters } from '@/components/dashboard/counters';
import { DonationPromised } from '@/components/dashboard/toBlessSomeone/donationPromised';
import { DonationReceived } from '@/components/dashboard/toBlessSomeone/donationReceived';
import { ToBless } from '@/components/dashboard/toBlessSomeone/toBless';
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
  // Vérifie si le profil existe dans la table profile
   const profile = await prismadb.profile.findFirst({
    where: { hashedEmail: currentUser?.hashedEmail },
  });
  // nbre de profile présent dans la table profile pour produire son CODEPIN
  const profileNbr = await prismadb.profile.count()
  // fakePhone = on prend le nbre de profile + 1000 afin qu'il soit unique
  const fakePhone = profileNbr + 1000 
  //
  // SERVER ACTION POUR CRÉER LE PROFIL
  async function create() {
    "use server";
    //
    if(session?.user?.email)
    {
      // le vrai email hashé
      const emailHashed = hashed(session?.user?.email)
      // le vrai email crypté
      const emailEncrypted = encrypt(session?.user?.email)
      //
      // provisoirement on crypt le faux n° profileNbr + 1000 
      const fakePhoneEncrypted = encrypt("0600000000")
      // provisoirement on hash le faux n° 0600000000
      const fakePhoneHased = hashed("0600000000")
      // provisoirement on hash le mot NOM
      const fakeLastnameEncrypted = encrypt("nom")
      //
      // on entre l'email hashé dans la table USER
      await prismadb.user.updateMany({
        where: { email: session?.user?.email },
        data: { hashedEmail: emailHashed }
      })
      // ON CRÉE SON PROFIL À MINIMA QU'IL UPDATERA ENSUITE
      await prismadb.profile.create({
        data: { 
          codepin: profileNbr + 1000,
          googleImage: currentUser?.image,
          hashedEmail: emailHashed,
          encryptedEmail: emailEncrypted,
          hashedPhone: fakePhoneHased,
          encryptedPhone: fakePhoneEncrypted,
          encryptedLastname: fakeLastnameEncrypted
        },
      });
    }
  }
  // Appelle la Server Action pour créer le profil
  if(!currentUser?.hashedEmail) // ou if (!profile)
  {
    await create(); 
  }
  // on reselect les infos du connecté (maintenant qu'on a updaté le hashedEmail)
  const connectedUser = await prismadb.user.findFirst({
    where:{ email: currentUser?.email }
  })
  // On select l'id du profile juste créer 
  const justCreated = await prismadb.profile.findFirst({
    where: { 
      codepin: profileNbr + 1000,
      hashedEmail: connectedUser?.hashedEmail 
    }
  })
  // si son pseudo === pseudo donc il n'a pas encore updaté son profile
  if(justCreated?.username === "pseudo" || justCreated?.firstname === "prénom" || justCreated?.city === "ville" || justCreated?.country === "pays")
  {
    redirect (`/dashboard/profile/${justCreated?.id}`)
  }
  //
  return (
    <div className='lg:pt-5 h-ull flex items-center flex-col bg-white/90'>
      <div className='w-full md:w-4/5 flex flex-col items-center m-4 gap-y-4 px-5 lg:pb-20'>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
          {/* montant total donné et reçu */}
          <Counters/> 
          {/* donner à un autre */}
          <ToBless/>   
          {/* promesses de dons faites */}
          <DonationPromised/> 
          {/* promesses de dons reçu */}  
          <DonationReceived/>        
        </div> 
      </div>
    </div>
  )
}
//
export default Dashboard

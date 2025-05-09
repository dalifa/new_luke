//
import { fetchCountries } from "@/actions/profile/update_Country"
import { auth } from "@/auth"
import { prismadb } from "@/lib/prismadb"
import { decrypt } from "@/lib/utils"
import { ProfileForm } from "./_component/profileForm"
//  
const Profile = async ({ params }: { params: { profileId: string } }) => {
  // la redirection pour les non connectés est faite depuis le fichier middleware 
  const session = await auth()
  //
  const userSession = await prismadb.user.findFirst({
    where: { email: session?.user?.email }
  })
  // Membre concerné
  const concerned = await prismadb.profile.findFirst({
    where: { 
      hashedEmail: userSession?.hashedEmail,
      id: params?.profileId
    } 
  })
  //
  // tous les pays
  const allCountries = await fetchCountries();
  //
  return (
    <div className='h-full flex flex-col items-center justify-center bg-indigo-600'> 
      <div className="flex w-full md:w-3/5 mt-5">
        <div className="flex flex-col items-center justify-center text-slate-600 bg-white rounded p-2 gap-y-5 md:p-5 w-full mx-8 shadow-xl">
          <div className="mt-5">
            <p className="text-center text-indigo-600 text-xl font-medium">Vos informations de profil</p>
          </div>
          <div className='w-full flex flex-col items-center justify-center gap-x-4 gap-y-10 mb-5 p-4'>
            { concerned && (
              <ProfileForm
              profile={{
                ...concerned,
                lastnameDecrypted: decrypt(concerned.encryptedLastname),
                phoneDecrypted: decrypt(concerned.encryptedPhone),
              }}
            />
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  )
}
//
export default Profile

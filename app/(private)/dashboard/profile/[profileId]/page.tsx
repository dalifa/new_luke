//
import { fetchCountries } from "@/actions/profile/update_Country"
import { auth } from "@/auth"
import { capitalize } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"
import { decrypt } from "@/lib/utils"
import { UpdateFirstname } from "./_component/updateFirstname"
import { UpdateLastname } from "./_component/updateLastname"
import { UpdateUsername } from "./_component/updateUsername"
import { UpdatePhone } from "./_component/updatePhone"
import { UpdateCity } from "./_component/updateCity"
import { UpdateCountry } from "./_component/updateCountry"
import { UpdateBio } from "./_component/updateBio"
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
      <div className="flex w-full md:w-3/5 mt-5 md:mt-20">
        <div className="grid grid-cols-1 text-slate-600 bg-white rounded p-2 gap-y-10 md:p-5 w-full shadow-md mx-4 shadow-blue-300">
          <div className="mt-5">
            <p className="text-center text-indigo-600 text-xl font-medium">Vos informations de profil</p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10 mb-5'>
            { concerned && (
              <>
            <div className="flex flex-row items-center gap-x-4">
              <UpdateFirstname profileId={concerned?.id}/>
              <p className='leading-relaxed text-lg font-medium'>
                {capitalize(concerned?.firstname)}
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <UpdateLastname profileId={concerned?.id}/>
              <p className='leading-relaxed text-lg font-medium'>
                {capitalize(decrypt(concerned?.encryptedLastname))}
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <UpdateUsername profileId={concerned?.id}/>
              <p className='leading-relaxed text-lg font-medium'>
                {capitalize(concerned?.username)}
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <UpdatePhone profileId={concerned?.id}/>
              <p className='leading-relaxed text-lg font-medium'>
                {decrypt(concerned?.encryptedPhone)}
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <UpdateCity profileId={concerned?.id}/>
              <p className='leading-relaxed text-lg font-medium'>
                {capitalize(concerned?.city)}
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <UpdateCountry profileId={concerned?.id} allCountries={allCountries}/>
              <p className='leading-relaxed text-lg font-medium'>
                {capitalize(concerned?.country)}
              </p>
            </div>
            <div className="flex flex-row items-center gap-x-4">
              <UpdateBio profileId={concerned?.id}/>
              <p className='leading-relaxed text-lg font-medium'>
                {capitalize(concerned?.bio)}
              </p>
            </div>
            </>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  )
}
//
export default Profile

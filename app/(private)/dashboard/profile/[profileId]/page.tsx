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
      googleEmail: userSession?.email,
      //id: params?.profileId
    } 
  })
  //
  // tous les pays
  const allCountries = await fetchCountries();
  // 
  return (
    <div className='h-ull flex items-center justify-center flex-col'> 
      <div className="flex w-full md:w-3/5 mt-5 md:mt-20">
        <div className="grid grid-cols-1 text-slate-600 bg-white rounded p-2 gap-y-10 md:p-5 w-full shadow-md mx-4 shadow-gray-300">
          <div className="flex flex-col">
            <p className="text-center text-red-800 text-xl font-medium">
              { concerned?.firstname === "prénom" || concerned?.firstname === "nom" || concerned?.username === "pseudo" 
                || concerned?.city === "ville" || concerned?.country === "pays" ? (
                  <span>Modifier vos&nbsp;</span>
                ):(<span>Vos&nbsp;</span>)  }
              informations de profil
            </p>
            <div className="px-4 pt-6 text-red-800">
              {concerned?.firstname === "prénom" && (<span>Prénom,&nbsp;</span>)}
              {decrypt(concerned?.encryptedLastname) === "nom" && (<span>Nom,&nbsp;</span>)}
              {concerned?.username === "pseudo" && (<span>Pseudo,&nbsp;</span>)}
              {concerned?.city === "ville" && (<span>Ville,&nbsp;</span>)}
              {concerned?.country === "pays" && (<span>Pays</span>)}
            </div> 
          </div>
          <div className='grid grid-cols-1 px-4 gap-y-2 mb-5'>
            { concerned && (
              <>
            <div className="grid grid-cols-2 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <p className='leading-relaxed text-lg font-medium'>
                  {capitalize(concerned?.firstname)}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <UpdateFirstname profileId={concerned?.id}/>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <p className='leading-relaxed text-lg font-medium'>
                  {capitalize(decrypt(concerned?.encryptedLastname))} 
                </p>
              </div>
              <div className="flex items-center justify-end">
                <UpdateLastname profileId={concerned?.id}/>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <p className='leading-relaxed text-lg font-medium'>
                  {capitalize(concerned?.username)}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <UpdateUsername profileId={concerned?.id}/>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <p className='leading-relaxed text-lg font-medium'>
                  {decrypt(concerned?.encryptedPhone)}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <UpdatePhone profileId={concerned?.id}/>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <p className='leading-relaxed text-lg font-medium'>
                  {capitalize(concerned?.city)}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <UpdateCity profileId={concerned?.id}/>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <p className='leading-relaxed text-lg font-medium'>
                  {capitalize(concerned?.country)}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <UpdateCountry profileId={concerned?.id} allCountries={allCountries}/>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-gray-100 p-4 rounded-md">
              <div className="flex items-center">
                <p className='leading-relaxed text-lg font-medium'>
                  {capitalize(concerned?.bio)}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <UpdateBio profileId={concerned?.id}/>
              </div>
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

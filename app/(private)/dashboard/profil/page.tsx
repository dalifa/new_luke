import CreateOrUpdateProfile from '@/components/dashboard/profil-components/profile-infos';
import { currentUser } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import { redirect } from 'next/navigation';
//
const Profile = async () => {
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const session = await currentUser()  
  /*
  // On vérifie s'il a repondu aux 5 questions
  const verifiedQuestionsCount = await prismadb.response.count({
    where: {
      googleEmail: session?.email,
      response1: true,
      response2: true,
      response3: true,
    //  response4: true,
    //  response5: true
    }
  }) 
  // s'il n'a pas encore répondu aux 5 questions d'engagement
  if(verifiedQuestionsCount < 1)
  {
    return redirect("/dashboard/questions")
  } */
  //
  return (
    <div className='h-ull flex items-center justify-center flex-col'>
      <CreateOrUpdateProfile/>
    </div>
  )
}
//
export default Profile

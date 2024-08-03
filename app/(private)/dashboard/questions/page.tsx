
import { DialogQR } from '@/components/dashboard/dialogQuestionResponse';
import { ResponseToQuestion } from '@/components/dashboard/questionResponses';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Stats = async () => {
  // la redirection pour les non connectés est faite depuis le fichier middleware
  const session = await currentUser()
  // question1
  const question1IsResponded = await prismadb.response.count({
    where: {
      googleEmail: session?.email,
      response1: true,
    }
  })
  // question2
  const question2IsResponded = await prismadb.response.count({
    where: {
      googleEmail: session?.email,
      response2: true,
    }
  })
  // question3
  const question3IsResponded = await prismadb.response.count({
    where: {
      googleEmail: session?.email,
      response3: true,
    }
  })

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
  // s'il a déjà répondu aux 5 questions d'engagement
  if(verifiedQuestionsCount === 1)
  {
    return redirect("/dashboard")
  }
  // s'il repond non à une question, il est redirigé vers la déconnexion

  return (
    <div className='h-ull flex items-center justify-center flex-col pt-5 lg:pt-20 gap-10'>
      <div className='w-4/5 lg:w-2/5 p-3 border rounded text-blue-500 text-center'>
        <p className='font-semibold text-lg lg:text-xl'>Questions d&apos;engagement</p>
      </div>
      <div className='w-4/5 lg:w-2/5 p-10 px-5 lg:px-10 bg-white shadow-md shadow-blue-100 border rounded'>
        {
          question1IsResponded < 1 && (
            <p className='text-center text-lg'>
              Croyez-vous qu&apos;il n'y a de salut en aucun autre nom si ce n&apos;est au nom de Jésus Christ ?
            </p>
          )
        }
        {
          question1IsResponded === 1 && question2IsResponded < 1 && (
            <p className='text-center text-lg'>
              Croyez-vous à cette affirmation du Seigneur Jésus Christ faite dans luc 6:38 qui dit: Donnez et il vous sera donné... ?
            </p>
          )
        }
        {
          question2IsResponded === 1 && question3IsResponded < 1 && (
            <p className='text-justify text-lg'>
              Par amour fraternel en Jésus Christ, pourriez-vous vous engager à donner au minimum 5€ par mois pendant une année, à un autre enfant de Dieu ?
            </p>
          )
        }
        <div className='grid grid-cols-2 px-0 py-4 gap-x-10 mt-10'>
          <div>
            <Link href={"/logout"}>
            <Button variant={"outline"} className='w-full'>
              Non
            </Button>
            </Link>
          </div>
          <div>
            <DialogQR/>
          </div>
        </div>
      </div>
    </div>
  )
}
//
export default Stats

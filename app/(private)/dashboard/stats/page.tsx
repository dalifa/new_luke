import { auth } from '@/auth';
import { CurrentProfile } from '@/hooks/own-current-user';

const Stats = async () => {
    const session = await auth();
    // la redirection pour les non connectés est faite depuis le fichier middleware
    const connectedUser = await CurrentProfile()
    return (
      <div className="w-full h-screen flex flex-col items-center  px-4 md:px-20 py-14 bg-indigo-600">
      <div className='my-10 md:my-14 border-4 border-indigo-400 text-white rounded-lg py-4 px-2 md:px-10'>
        <h1 className='text-center text-2xl md:text-3xl font-semibold'>
          Statistiques
        </h1>
      </div>
    </div>
    )
}

export default Stats

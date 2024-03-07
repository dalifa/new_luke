import { auth } from '@/auth';
import { currentUserInfos } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';

const Stats = async () => {
    const session = await auth();
    // la redirection pour les non connectés est faite depuis le fichier middleware
    const connectedUser = await currentUserInfos()
    return (
        <div className='h-ull flex items-center justify-center flex-col'>
            <p>stats</p>
            <p>connected email: {connectedUser?.role}</p>
        </div>
    )
}

export default Stats

import { auth } from '@/auth';
import { CurrentProfile } from '@/hooks/own-current-user';

const Stats = async () => {
    const session = await auth();
    // la redirection pour les non connectés est faite depuis le fichier middleware
    const connectedUser = await CurrentProfile()
    return (
        <div className='pt-14 h-ull flex items-center justify-center flex-col'>
            <p>stats</p>
            {/* <AddFakeProfile/> */}
        </div>
    )
}

export default Stats

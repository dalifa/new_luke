import { auth } from '@/auth';
import CreateOrUpdateProfile from '@/components/dashboard/profile-infos';
import { prismadb } from '@/lib/prismadb';

const Profile = async () => {
    const session = await auth();
    // la redirection pour les non connectés est faite depuis le fichier middleware
    const connectedUser = await prismadb.user.findFirst({
        where: { email: session?.user.email }
    })
    return (
        <div className='h-ull flex items-center justify-center flex-col'>
            <CreateOrUpdateProfile/>
        </div>
    )
}

export default Profile

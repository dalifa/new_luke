//
// dashboard/page.tsx
import { createMinimalProfile } from '@/actions/profile/create_Minimal_Profil';
import { auth } from '@/auth';
import { Counters } from '@/components/dashboard/counters';
import { DonationPromised } from '@/components/dashboard/toBlessSomeone/donationPromised';
import { DonationReceived } from '@/components/dashboard/toBlessSomeone/donationReceived';
import { ToBless } from '@/components/dashboard/toBlessSomeone/toBless';
import { prismadb } from '@/lib/prismadb';
import { redirect } from 'next/navigation';


const Dashboard = async () => {
  const session = await auth();

  const currentUser = await prismadb.user.findFirst({
    where: { email: session?.user?.email },
  });

  if (!currentUser) {
    redirect('/');
  }

  // Si aucun profil, on le crée
  let profile = await prismadb.profile.findFirst({
    where: { hashedEmail: currentUser.hashedEmail },
  });

  if (!profile) {
    profile = await createMinimalProfile(currentUser);
  }

  // Si le profil est incomplet, on redirige vers l’édition
  if (profile && !profile.isProfileComplete) {
    redirect(`/dashboard/profile/${profile.id}`);
  }

  return (
    <div className='lg:pt-5 h-full flex items-center flex-col bg-indigo-600'>
      <div className='w-full md:w-4/5 flex flex-col items-center pt-10 m-4 gap-y-4 px-5 lg:pb-20'>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
          <Counters />
          <ToBless />
          <DonationPromised />
          <DonationReceived />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


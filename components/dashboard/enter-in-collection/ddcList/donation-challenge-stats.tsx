
import { prismadb } from "@/lib/prismadb";
import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { Card } from "@/components/ui/card";

export const DonationChallengeStats = async () => {
  const session = await auth()
  // vous avez donné combien depuis l'inscription
  // vous avez reçu combien depuis l'inscription
  const profile:any = await currentUserInfos()
  // nombre de personnes sur la plateforme
  const memberCount = await prismadb.profile.count({
    where: { isActiveAccount: true }
  })
  // conbien a déjà été donné sur la plateforme
  const ddcCount = await prismadb.metric.findFirst()
  // ###
  return (
    <Card className='bg-white shadow-blue-200 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-500 text-md lg:text-lg'>
        DDC Stats
      </p>
      <hr className='w-full mb-2'/>
      <div className=' grid grid-cols-1 gap-4 bg-white'>
        <div className="flex flex-row items-center justify-between text-slate-500">
          <p>Membres sur la plateforme</p>
          <p className="text-green-600">{memberCount}</p>
        </div>
        <div className="flex flex-row items-center justify-between text-slate-500">
          <p>Total donné sur la platforme</p>
          <p className="text-green-600">{ddcCount?.totalDdcGiven}</p>
        </div>
        <div className="flex flex-row items-center justify-between text-slate-500">
          <p>Total donné par vous</p>
          <p className="text-green-600">{profile?.ddcGiven}</p>
        </div>
        <div className="flex flex-row items-center justify-between text-slate-500">
          <p>Total reçu par vous</p>
          <p className="text-green-600">{profile?.ddcReceived}</p>
        </div>
      </div>
    </Card>
  ); 
};

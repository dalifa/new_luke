
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
// TOUS LES DON QU'ON A PROMIS
export const DonationPromised = async () => {
  const connected = await CurrentProfile()
  //
  //
  // 
  return ( 
    <Card className='bg-white shadow-blue-100 shadow-md p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-xl lg:text-lg'>
        PROMESSES DE DONS FAIT
      </p>
      <hr className='w-full mb-2'/>
    </Card>
  ); 
};

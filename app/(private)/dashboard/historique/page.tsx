
import {
  Card,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';
// pour forma date
import { format } from "date-fns"
// on crée une constance pour date
const DATE_FORMAT = "d MMM yyyy" 

const History = async () => {
  const connected = await CurrentProfile()
  //    HISTORIQUE DES LISTES DE BÉNÉDICTIONS
  const historics = await prismadb.collectionParticipant.findMany({
    where: {
      participantId: connected?.id,
      recipientValidation: true
    }
  }) 
  return (
      <div className='h-full flex items-center justify-center flex-col px-5  gap-5 bg-indigo-600'>
        <div className='w-4/5 lg:w-2/5 p-3 mt-10 border rounded text-center bg-white shadow-xl'>
          <p className='text-indigo-600 text-center text-xl'>
            Historique des bénédictions
          </p>
        </div>
        <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
            {
              historics.map((historic) => (
                <div key={historic?.id}>
                  <Link  href={`/dashboard/historique/${historic?.id}`}>
                    <Card className='flex items-center flex-col shadow-md p-4 text-center gap-y-2'>
                        <p className='text-xl font-medium text-indigo-600'>
                          Liste de bénédiction de {historic?.concernedAmount}{connected?.currency}
                        </p>
                        <p className='text-xs text-gray-500'>Du: {format(new Date(historic?.createdAt), DATE_FORMAT)}</p>
                    </Card>
                  </Link>
                </div>
              ))
            }
            </div>
      </div>
    )
}

export default History

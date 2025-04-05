
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { capitalize, CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import Link from 'next/link';
// pour forma date
import { format } from "date-fns"
// on crée une constance pour date
const DATE_FORMAT = "d MMM yyyy"

const History = async () => {
  const connected = await CurrentProfile()
  //    HISTORIQUE DES BÉNÉDICTIONS FAITES
  const blessingsMade = await prismadb.myListToBless.findMany({
    where: {
      donorId: connected?.id,
      recipientValidation: true
    }
  }) 
  //    HISTORIQUE DES BÉNÉDICTIONS REÇU
  const blessingsReceived = await prismadb.myListToBless.findMany({
    where: {
      chosenRecipient: connected?.id,
      recipientValidation: true
    }
  }) 
  return (
      <div className='h-full flex items-center justify-center flex-col px-5  gap-5 bg-white'>
        <div className='w-4/5 lg:w-2/5 p-3 border rounded text-center bg-white shadow-md shadow-blue-100'>
          <p className='text-slate-700 text-center text-xl'>
            Historique des bénédictions
          </p>
        </div>
        <Tabs defaultValue="made" className="">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="made">Dons faits</TabsTrigger>
            <TabsTrigger value="received">Dons reçus</TabsTrigger>
          </TabsList>
          <TabsContent value="made">
            <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
            {
              blessingsMade.map((made) => (
                <div key={made?.id}>
                  <Link  href={`/dashboard/historique/${made?.id}`}>
                    <Card className='flex items-center flex-col shadow-md shadow-blue-100 p-4 text-center gap-y-2'>
                        <p className='text-xl font-medium text-blue-500'>
                          Bénédiction de {made?.amount}{connected?.currency}
                        </p>
                        <p className='text-xs text-gray-500'>Du: {format(new Date(made?.createdAt), DATE_FORMAT)}</p>
                    </Card>
                  </Link>
                </div>
              ))
            }
            </div>
          </TabsContent>
          <TabsContent value="received">
            <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4'>
            {
              blessingsReceived.map((received) => (
                <div key={received?.id}>
                  <Link  href={`/dashboard/historique/${received?.id}`}>
                    <Card className='flex items-center flex-col shadow-md shadow-blue-100 p-4 text-center gap-y-2'>
                      <p className='text-xl font-medium text-blue-500'>
                        Bénédiction de {received?.amount}{connected?.currency}
                      </p>
                      <p className='text-xs text-gray-500'>Du: {format(new Date(received?.createdAt), DATE_FORMAT)}</p>
                    </Card>
                  </Link>
                </div>
              ))
            }
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
}

export default History

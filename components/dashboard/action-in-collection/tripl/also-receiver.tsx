
'use client'

import { Button } from "@/components/ui/button"
import { HandCoins} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { justDonator } from "@/actions/tripl/just-donator";

export function AlsoReceiver({ collectionId }: { collectionId: string }) {
  const alsoReceiverId = justDonator.bind(null, collectionId)
  //

  return (
    <form action={alsoReceiverId} className="flex flex-col gap-y-5 p-2">
      <Input name="project" type={"hidden"} placeholder="Ex: achat de billet de train" className="h-12 bg-blue-200 rounded" />
      <Button variant={"outline"} className='text-green-600 flex gap-x-4 hover:text-blue-500'>
        Devenir désignable<HandCoins className='w-5 h-5'/>
      </Button>
    </form>
  )
}

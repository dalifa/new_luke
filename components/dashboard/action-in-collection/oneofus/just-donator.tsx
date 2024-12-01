
'use client'

import { ToggleRight} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { justDonator } from '@/actions/oneofus/just-donator';

export function OneofusJustToGive({ collectionId }: { collectionId: string }) {
  const notReceiveId = justDonator.bind(null, collectionId)
  //
  return (
    <form action={notReceiveId} className="flex flex-col">
      {/* ce input est un leurre, il ne sert à rien */}
      <Input name="project" type={"hidden"} placeholder="Ex: achat de billet de train"/>
      <button>
        <ToggleRight className='text-sm text-violet-600 cursor-pointer'/>
      </button> 
    </form>
  )
}

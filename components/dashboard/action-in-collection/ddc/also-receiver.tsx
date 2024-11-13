
'use client'

import { ToggleLeft} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { justDonator } from "@/actions/ddc/just-donator";

export function DdcAlsoReceiver({ collectionId }: { collectionId: string }) {
  const alsoReceiverId = justDonator.bind(null, collectionId)
  //
  return (
    <form action={alsoReceiverId} className="flex flex-col p-0">
      {/* ce input est un leurre, il ne sert à rien */}
      <Input name="project" type={"hidden"} />
      <button>
        <ToggleLeft className="text-sm text-red-600 cursor-pointer"/>
      </button>
    </form>
  )
}

/*
*/
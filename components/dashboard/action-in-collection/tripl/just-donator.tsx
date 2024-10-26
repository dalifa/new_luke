
'use client'
import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Ban} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { justDonator } from '@/actions/tripl/just-donator';

export function JustToGive({ collectionId }: { collectionId: string }) {
  const notReceiveId = justDonator.bind(null, collectionId)
  //

  return (
    <form action={notReceiveId} className="flex flex-col gap-y-5 p-2">
      <Input name="project" type={"hidden"} placeholder="Ex: achat de billet de train" className="h-12 bg-blue-200 rounded" />
      <Button variant={"outline"} className='text-red-900 flex gap-x-4'>
        Renoncer à recevoir<Ban className='w-5 h-5'/>
      </Button>
    </form>
  )
}

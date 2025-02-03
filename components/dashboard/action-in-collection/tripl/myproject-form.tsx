'use client'
import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Gift } from 'lucide-react';
import { updateProject } from '@/actions/tripl/update-project-action';
export function MyProjectForm({ collectionId }: { collectionId: string }) {
  const updateProjectWithId = updateProject.bind(null, collectionId)
  //
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour fermer le popover
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Gift onClick={() => setIsOpen(true)} className='w-7 h-7 text-blue-500 cursor-pointer'/>
      </PopoverTrigger>
      <PopoverContent className="w-72 ml-10 md:ml-5">
        <form action={updateProjectWithId} className="flex flex-col gap-y-5 p-2">
          <div className='flex flex-col text-center text-md md:text-lg mb-2 text-slate-500'>
            <p className='text-md'>Entrez le projet que vous souhaitez faire financer.</p>
            <p className='text-xs'>NB:&nbsp; 60 caractères maxi.</p>
          </div>
          <Textarea name="project" placeholder="Ex: achat de billet de train" className="h-12 bg-blue-100 rounded" />
          <Button variant={"blue"} onClick={handleClose} className="h-12">Enregistrer</Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}

/*

*/
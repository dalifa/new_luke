'use client'
import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" 
import { Gift } from 'lucide-react';
import { updateProject } from '@/actions/oneofus/update-project-action';

export function MyOneofusProjectForm({ collectionId }: { collectionId: string }) {
  const updateProjectWithId = updateProject.bind(null, collectionId)
  //
  const [isOpen, setIsOpen] = useState(false);
  // Fonction pour fermer le popover
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Gift onClick={() => setIsOpen(true)} className='text-violet-600 cursor-pointer'/>
      </DialogTrigger>
      <DialogContent className="w-4/5 sm:max-w-[424px] rounded-md">
        <DialogHeader className='pt-4'>
          <DialogTitle className='text-slate-500 mb-4 text-center'>Entrez le projet à faire financer</DialogTitle>
          <DialogDescription className='text-center text-sm'>
            NB: 60 caractères maxi.
          </DialogDescription>
        </DialogHeader>
        <form action={updateProjectWithId} className="flex flex-col gap-y-5 p-2">
          <Textarea name="project" placeholder="Ex: Achat de billet de train" className="h-12 bg-violet-200 text-slate-600 rounded"/>
          <Button variant={"blue"} onClick={handleClose} className="h-12">Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/*
*/
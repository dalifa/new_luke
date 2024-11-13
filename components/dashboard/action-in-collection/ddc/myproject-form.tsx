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
import { updateProject } from '@/actions/ddc/update-project-action';

export function MyDdcProjectForm({ collectionId }: { collectionId: string }) {
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
        <Gift onClick={() => setIsOpen(true)} className=' text-violet-600 cursor-pointer'/>
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
          <Button variant={"violet"} onClick={handleClose} className="h-12">Enregistrer</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/*
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

*/
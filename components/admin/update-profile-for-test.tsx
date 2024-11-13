'use client'
import React, { useState } from 'react';

import { Button } from "@/components/ui/button"
import { Input } from '../ui/input';
import { updateProfileForTest } from '@/actions/ddc/update-profile-for-test';

export function ProfileForTest({ collectionId }: { collectionId: string }) {
  const updateProfileWithId = updateProfileForTest.bind(null, collectionId)
  //
  const [isOpen, setIsOpen] = useState(false);
  // Fonction pour fermer le popover
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <form action={updateProfileWithId} className="flex flex-col gap-y-5 p-2">
      <Input name="profileConcerned" placeholder="Ex: username" className="h-12 bg-violet-200 text-slate-600 rounded"/>
      <Button variant={"violet"} onClick={handleClose} className="h-12">Enregistrer</Button>
    </form>
  )
}

/*
*/
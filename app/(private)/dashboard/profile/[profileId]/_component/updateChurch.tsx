'use client'
//
import { Church } from 'lucide-react';
import { UpdateFieldDialog } from './updateFieldDialog';
import { updateChurch } from '@/actions/profile/updateChurch';
//
export function UpdateChurch({ profileId }: { profileId: string }) {
  const handleUpdate = updateChurch.bind(null, profileId)
  //  
  // Définition des valeurs des props
  const label = "Modifier votre Église";
  const placeholder = "ex: ICC Croissy";
  const icon = Church;

  return (
    <UpdateFieldDialog
      label={label}
      placeholder={placeholder}
      onSubmit={handleUpdate}
      icon={icon}
    />
  );
}
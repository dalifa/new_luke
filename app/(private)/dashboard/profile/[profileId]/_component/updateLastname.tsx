'use client'

import { updateLastname } from '@/actions/profile/updateLastname';
import { UserRoundCog } from 'lucide-react';
import { UpdateFieldDialog } from './updateFieldDialog';
// 
export function UpdateLastname({ profileId }: { profileId: string }) {
  const handleUpdate = updateLastname.bind(null, profileId)
  //  
  // Définition des valeurs des props
  const label = "Modifier votre Nom";
  const placeholder = "ex: Band";
  const icon = UserRoundCog;

  return (
    <UpdateFieldDialog
      label={label}
      placeholder={placeholder}
      onSubmit={handleUpdate}
      icon={icon}
    />
  );
}
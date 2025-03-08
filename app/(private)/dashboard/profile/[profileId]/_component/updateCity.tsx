'use client'
import { updateCity } from '@/actions/profile/updateCity';
//
import { Building2 } from 'lucide-react';
import { UpdateFieldDialog } from './updateFieldDialog';
//
export function UpdateCity({ profileId }: { profileId: string }) {
  const handleUpdate = updateCity.bind(null, profileId)
  //  
  // Définition des valeurs des props
  const label = "Modifier votre Ville";
  const placeholder = "ex: Paris";
  const icon = Building2;

  return (
    <UpdateFieldDialog
      label={label}
      placeholder={placeholder}
      onSubmit={handleUpdate}
      icon={icon}
    />
  );
}
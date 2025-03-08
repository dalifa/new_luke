'use client'
import { updateBio } from '@/actions/profile/updateBio';
import { FileText } from 'lucide-react';
import { UpdateFieldDialog } from './updateFieldDialog';
//
export function UpdateBio({ profileId }: { profileId: string }) {
  const handleUpdate = updateBio.bind(null, profileId)
  //  
  // Définition des valeurs des props
  const label = "Modifier votre Présentation";
  const placeholder = "ex: je sers à l'intercession";
  const icon = FileText;

  return (
    <UpdateFieldDialog
      label={label}
      placeholder={placeholder}
      onSubmit={handleUpdate}
      icon={icon}
    />
  );
}
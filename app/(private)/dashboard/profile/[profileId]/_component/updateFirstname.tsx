"use client"
import { updateFirstname } from '@/actions/profile/updateFirstname';
import { UserRoundCheck } from 'lucide-react';
import { UpdateFieldDialog } from './updateFieldDialog';

export function UpdateFirstname({ profileId }: { profileId: string }) {
  const handleUpdate = updateFirstname.bind(null, profileId);

  // Définition des valeurs des props
  const label = "Modifier votre Prénom";
  const placeholder = "ex: James";
  const icon = UserRoundCheck;

  return (
    <UpdateFieldDialog
      label={label}
      placeholder={placeholder}
      onSubmit={handleUpdate}
      icon={icon}
    />
  );
}



/*

*/
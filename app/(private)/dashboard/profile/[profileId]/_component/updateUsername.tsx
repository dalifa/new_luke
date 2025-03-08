'use client'
import { updateUsername } from '@/actions/profile/updateUsername';
import { UserRound } from 'lucide-react';
import { UpdateFieldDialog } from './updateFieldDialog';
//
export function UpdateUsername({ profileId }: { profileId: string }) {
  const handleUpdate = updateUsername.bind(null, profileId)
  //   
  // Définition des valeurs des props
  const label = "Modifier votre Pseudo";
  const placeholder = "ex: 007";
  const icon = UserRound;

  return (
    <UpdateFieldDialog
      label={label}
      placeholder={placeholder}
      onSubmit={handleUpdate}
      icon={icon}
    />
  );
}
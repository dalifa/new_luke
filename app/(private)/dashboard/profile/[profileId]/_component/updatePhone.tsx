'use client'
import { updatePhone } from '@/actions/profile/updatePhone';
//
import { Phone} from 'lucide-react';
import { UpdateFieldDialog } from './updateFieldDialog';
//
export function UpdatePhone({ profileId }: { profileId: string }) {
  const handleUpdate = updatePhone.bind(null, profileId)
  //   
  // Définition des valeurs des props
  const label = "Modifier votre Portable";
  const placeholder = "ex: 0600000001";
  const icon = Phone;

  return (
    <UpdateFieldDialog
      label={label}
      placeholder={placeholder}
      onSubmit={handleUpdate}
      icon={icon}
    />
  );
}
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormState } from 'react-dom'
import { Textarea } from '@/components/ui/textarea'
import { updateFullProfile } from '@/actions/profile/updateProfile'

type FormState = {
  error?: string
  success?: boolean
}

export function ProfileForm({ profile }: { profile: any }) {
  const update = updateFullProfile.bind(null, profile.id)
  const initialState = { error: undefined, success: false };
  const [state, formAction] = useFormState(update, initialState);
  //
  return (
    <form action={formAction} className="space-y-4 w-full">
      <Input name="firstname" placeholder="Prénom" defaultValue={profile.firstname} required />
      <Input name="lastname" placeholder="Nom" defaultValue={profile.lastnameDecrypted} required />
      <Input name="username" placeholder="Pseudo" defaultValue={profile.username} required />
      <Input name="phone" placeholder="Téléphone" defaultValue={profile.phoneDecrypted} required />
      <Input name="city" placeholder="Ville" defaultValue={profile.city} required />
      <Input name="country" placeholder="Pays" defaultValue={profile.country} required />
      <Textarea name="bio" placeholder="Bio" defaultValue={profile.bio} required />

      {state?.error && <p className="text-red-500">{state.error}</p>}
      {state?.success && <p className="text-green-600">Profil mis à jour avec succès.</p>}

      <Button type="submit" variant={"success"} className="w-full">Mettre à jour</Button>
    </form>
  )
}


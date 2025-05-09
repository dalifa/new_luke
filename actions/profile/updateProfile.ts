// actions/profile/update-full-profile.ts
'use server'

import { auth } from '@/auth'
import { prismadb } from '@/lib/prismadb'
import { encrypt, hashed } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

type FormState = {
  error?: string
  success?: boolean
}

export async function updateFullProfile(
  profileId: string,
  _: FormState,
  formData: FormData
): Promise<FormState> {
  //
  const session = await auth()

  const user = await prismadb.user.findFirst({
    where: { email: session?.user?.email },
  })

  const profile = await prismadb.profile.findFirst({
    where: {
      id: profileId,
      hashedEmail: user?.hashedEmail,
    },
  })

  if (!profile) {
    return { error: 'Profil introuvable.' }
  }

  const firstname = formData.get('firstname')?.toString().trim() || ''
  const lastname = formData.get('lastname')?.toString().trim() || ''
  const username = formData.get('username')?.toString().trim() || ''
  const phone = formData.get('phone')?.toString().trim() || ''
  const city = formData.get('city')?.toString().trim() || ''
  const country = formData.get('country')?.toString().trim() || ''
  const bio = formData.get('bio')?.toString().trim() || ''

  const isComplete =
    firstname !== '' &&
    lastname !== '' &&
    username !== '' &&
    phone !== '' &&
    city !== '' &&
    country !== '' &&
    bio !== ''

  await prismadb.profile.update({
    where: { id: profile.id },
    data: {
      firstname,
      city,
      country,
      username,
      bio,
      encryptedLastname: encrypt(lastname),
      encryptedPhone: encrypt(phone),
      isProfileComplete: isComplete,
      currency: "€"  // ceci est provisoir pour le beta-test
    },
  })

  revalidatePath(`/dashboard/profile/${profile.id}`)

  return { success: true }
}

/* 
*/
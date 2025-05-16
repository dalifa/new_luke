'use server'

import { prismadb } from '@/lib/prismadb'
import { encrypt, hashed } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function updateFullProfile(_: any, formData: FormData) {
  try {
    const profileId = formData.get('profileId') as string
    const firstname = formData.get('firstname') as string
    const lastname = formData.get('lastname') as string
    const username = formData.get('username') as string
    const phone = formData.get('phone') as string
    const city = formData.get('city') as string
    const country = formData.get('country') as string
    const bio = formData.get('bio') as string

    const encryptedLastname = encrypt(lastname)
    const encryptedPhone = encrypt(phone)
    const hashedPhoneValue = hashed(phone)

    const selectedCountry = await prismadb.country.findFirst({
      where: { name: country }
    })

    const currency = selectedCountry?.currency ?? 'not informed'

    await prismadb.profile.update({
      where: { id: profileId },
      data: {
        firstname,
        encryptedLastname,
        username,
        encryptedPhone,
        hashedPhone: hashedPhoneValue,
        city,
        country,
        bio,
        currency,
        isProfileComplete: true
      }
    })
    revalidatePath(`/dashboard/profile/${profileId}`)
    return { success: true }
  } catch (error) {
    return { error: 'Erreur lors de la mise à jour du profil.' }
  }
}




/* AVANT actions/profile/update-full-profile.ts
'use server'

import { auth } from '@/auth'
import { prismadb } from '@/lib/prismadb'
import { encrypt } from '@/lib/utils'
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
    },
  })

  revalidatePath(`/dashboard/profile/${profile.id}`)

  return { success: true }
}
*/
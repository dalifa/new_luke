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




/* 
*/
'use server';

import { prismadb } from '@/lib/prismadb';
import { encrypt, hashed } from '@/lib/utils';
import { User } from '@prisma/client';
import { generateUniquePin } from './generate_unique_pin';

// Crée un profil minimal si inexistant
export async function createMinimalProfile(currentUser: User) {
  if (!currentUser?.email) return null;

  const hashedEmail = hashed(currentUser.email);
  const encryptedEmail = encrypt(currentUser.email);
  const encryptedPhone = encrypt('0600000000');
  const hashedPhone = hashed('0600000000');
  const encryptedLastname = encrypt('nom');

  // Génère un codepin unique
  const uniquePin = await generateUniquePin();


  // Met à jour le user avec le hashedEmail
  await prismadb.user.updateMany({
    where: { email: currentUser.email },
    data: { hashedEmail },
  });

  // Crée le profil
  const newProfile = await prismadb.profile.create({
    data: {
      codepin: uniquePin,
      googleImage: currentUser.image,
      hashedEmail,
      encryptedEmail,
      hashedPhone,
      encryptedPhone,
      encryptedLastname,
      // Champs initiaux par défaut (username, city, etc. sont dans le modèle)
    },
  });

  return newProfile;
}

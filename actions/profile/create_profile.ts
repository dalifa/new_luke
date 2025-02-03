//  SANS CRYPTAGE 
"use server";
//
import * as z from "zod";
import { CreateProfileSchema } from "@/schemas";
import { prismadb } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { encrypt, hashed } from "@/lib/utils";
import { auth } from "@/auth";
//
export const createProfile = async (values: z.infer<typeof CreateProfileSchema>) => {
  const validatedFields = CreateProfileSchema.safeParse(values);
  //
  if (!validatedFields.success) {
    return { error: "Invalid fields!", details: validatedFields.error.errors };
  }
  //
  const {
    firstname, 
    lastname,
    username,
    phone,
    city,
    country,
    bio,
  } = validatedFields.data;
  // On vérifie le phone
  const cleanedPhone = phone.trim().replace(/\s+/g, '');
  // On hashe le phone cleaned
  const choosenHashedPhone = hashed(cleanedPhone)
  // Vérifier si le téléphone existe déjà
  const existingPhone = await prismadb.profile.findUnique({
    where: { hashedPhone: choosenHashedPhone },
  });
  //
  if (existingPhone) {
    return { error: "Ce numéro de portable est déjà utilisé!" };
  }
  //
    const session = await auth()
    //
    const userSession = await prismadb.user.findFirst({
      where: { email: session?.user.email}
    })
    
    if(userSession?.email)
    {
      // on hash l'email pour servir dans la comparaison avec celui de la table profile 
      const emailHashed = hashed(userSession?.email);
      //
      await prismadb.user.updateMany({
        where: {email: userSession?.email},
        data: {hashedEmail: emailHashed}
      })
      //
      const phoneAlreadyExist = await prismadb.profile.count({
        where: { hashedPhone: choosenHashedPhone}
      })
      // SI LE PHONE N'EST PAS DÉJÀ DANS LA TABLE PROFILE = EN ENREGISTRE
      if(phoneAlreadyExist === 0)
      {
        // Cryptage des champs sensibles
        const encryptedPhone = encrypt(cleanedPhone);
        const encryptedLastname = encrypt(lastname);  // a voir
        const emailEncrypted = encrypt(userSession?.email)
        // on compte le nombre de profile
        const profileCount = await prismadb.profile.count()
        // Insertion dans la base de données
        await prismadb.profile.create({
          data: {
            codepin: profileCount + 1000,
            userId: session?.user?.id,
            hashedEmail: emailHashed,
            encryptedEmail: emailEncrypted,
            googleImage: userSession?.image,
            username,
            firstname,
            encryptedLastname,
            encryptedPhone,
            hashedPhone: choosenHashedPhone,
            city,
            country,
            bio
          },
        });
        // on select la currency
        const search = await prismadb.country.findFirst({
          where: {name: country}
        })
        // on select celui qu'on vient d'ajouter pour avoir son profileId 
        const justAdded = await prismadb.profile.findFirst({
          where: {
            firstname,
            hashedEmail: emailHashed,
            city,
          },
          orderBy:{ id: "desc"} 
        })
        // on lui entre la currency
        await prismadb.profile.updateMany({
          where: { id: justAdded?.id},
          data: {currency: search?.currency}
        })  
        //
        redirect(`/dashboard/profile/${justAdded?.id}`)
      }
    }
};

//
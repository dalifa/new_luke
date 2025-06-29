// 
"use server";

import { prismadb } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { SearchFriendSchema } from "@/schemas";
import { CurrentProfile } from "@/hooks/own-current-user";
import { hashed } from "@/lib/utils";
import { revalidatePath } from "next/cache";
//
export const searchFriend = async (formData: FormData) => {
  const connected = await CurrentProfile();
  //
  const rawPhone = formData.get("phoneSearched") as string;
  const phone = rawPhone.trim().replace(/\s+/g, ""); // Nettoyage

  const validated = SearchFriendSchema.safeParse({ phoneSearched: phone });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const phoneHashed = hashed(phone);

  // ON VERIFIE SI LE CONNECTE A DÉJÀ EFFECTUE UNE RECHERCHE
  const existCount = await prismadb.mySearch.count({
    where: { profileId: connected?.id }
  })

  if(existCount < 1 )
  {
    await prismadb.mySearch.create({
      data: { 
        searchedPhone: phoneHashed,
        profileId: connected?.id
      },
    });
  } // ON UPDATE POUR ENTRER SA RECCENTE RECHERCHE
  else{
    await prismadb.mySearch.updateMany({
      where: { profileId: connected?.id },
      data: { searchedPhone: phoneHashed }
    })
  }
  //
  revalidatePath("/dashboard/retrouver");
};

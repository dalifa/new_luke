"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";

// TODO: ADD COUNTRY
export const addCountryCurrency = async (formData: FormData) => {
  //
  const profileCount = await prismadb.profile.count()
  const countryData = formData.get('name, currency, usezone') as string
  
  const addcountry = await prismadb.country.create({
    data: {
      countryData
    }
  }) 

  //
  revalidatePath("/dashboard/admin")
  //
};
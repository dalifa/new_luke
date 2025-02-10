// actions/choice my ministries.ts
'use server';
import { auth } from "@/auth";
// 
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
//
export const fetchCountries = async () => {
  const countries = await prismadb.country.findMany();
  return countries.map((country) => ({
    value: country.id, // 
    label: country.name, // Le libellé à afficher dans le select 
  }));
};
// 
// ################### 
// 
export const changeCountry = async (profileId: string, country: string) => {
  const session = await auth()
  //
  const useSession = await prismadb.user.findFirst({
    where: { email: session?.user?.email }
  })
  // concerned
    const concerned = await prismadb.profile.findFirst({
      where:{ 
        id: profileId,
        hashedEmail: useSession?.hashedEmail 
      }
    })
    // le nom du pays choisi
    const chosenCountry = await prismadb.country.findFirst({
      where: { id: country }
    })
    // 
    await prismadb.profile.updateMany({
      where: { id: concerned?.id },
      data: { 
        country: chosenCountry?.name,
        currency: chosenCountry?.currency 
      }, //
    });
    console.log("pays choisi: " + chosenCountry?.name)
    // TODO: ACTIVITY
    await prismadb.activity.create({
    data: { 
      author: concerned?.firstname,
      activity: "dont le codepin est: " + concerned?.codepin + " a choisi le pays " + chosenCountry?.name + "."
    }
  })
    //
    revalidatePath(`/dashboard/profile/${profileId}`)
  };
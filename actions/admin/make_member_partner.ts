"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
// 
export const makeAndUnmakePartner = async (memberManagedId: string, formData:any) => {
  const amountToRemove = formData.get("amount");
  //
  const connected = await CurrentProfile()
  //
  const concerned = await prismadb.profile.findFirst({
    where: {id: memberManagedId}
  })
  //
  if(connected?.role == "ADMIN")
  { 
    // ON DIMINU SON CREDIT DE AMOUNT
    if(concerned?.isPartner === false)
    {  
      await prismadb.profile.updateMany({
        where: { id: concerned?.id },
        data: { isPartner: true }
      })
      // ACTIVITY
      await prismadb.activity.create({
        data: {
          author: connected?.firstname,
          activity: "dont le codepin est " + connected?.codepin + " vient de faire de " + concerned?.firstname + " codepin: " + concerned?.codepin + "."
        }
      })
      //
      revalidatePath(`/dashboard/admin/${concerned?.id}`)
      //
    }else{
      await prismadb.profile.updateMany({
        where: { id: concerned?.id },
        data: { isPartner: false }
      })
      // ACTIVITY
      await prismadb.activity.create({
        data: {
          author: connected?.firstname,
          activity: "dont le codepin est " + connected?.codepin + " vient de faire de " + concerned?.firstname + " codepin: " + concerned?.codepin + "ne plus devenir partner"
        }
      })
      //
      revalidatePath(`/dashboard/admin/${concerned?.id}`)
    }
  } 
};
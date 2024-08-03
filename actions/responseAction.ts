"use server";

import { currentUser } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// AMOUNT TWO COLLECTION ENTER  
export const responseAction = async () => {
  const session = await currentUser() // en prod
  //
  const countQuestion1 = await prismadb.response.count({
    where: {
      googleEmail: session?.email,
      response1: true
    }
  })
  //
  const countQuestion2 = await prismadb.response.count({
    where: {
      googleEmail: session?.email,
      response2: true
    }
  })
  //
  const countQuestion3 = await prismadb.response.count({
    where: {
      googleEmail: session?.email,
      response3: true
    }
  })
  if(countQuestion1 < 1)
  {
    await prismadb.response.create({
      data: {
        googleEmail: session?.email,
        response1: true
      }
    })
  }
  if(countQuestion1 == 1 && countQuestion2 < 1)
  {
    await prismadb.response.updateMany({
      where:{
        googleEmail: session?.email
      },
      data: {
        response2: true
      }
    })
  }
  if(countQuestion2 == 1 && countQuestion3 < 1)
    {
      await prismadb.response.updateMany({
        where:{
          googleEmail: session?.email
        },
        data: {
          response3: true
        }
      })
    }
  //
  revalidatePath('/dashboard');
  redirect('/dashboard')
}

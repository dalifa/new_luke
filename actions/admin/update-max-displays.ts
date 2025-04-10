"use server";
import { CurrentProfile } from "@/hooks/own-current-user";
//
import { prismadb } from "@/lib/prismadb";
import { decrypt } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

//DIMINUER
export async function decreaseMaxDisplays() {
   const connected = await CurrentProfile() 
   //
  const metric = await prismadb.metric.findFirst();
  if (!metric || metric.maxDisplays <= 1) return;

  if(connected && connected?.isActiveAccount && connected?.role === "USER") // admin en production
  {
    await prismadb.metric.update({
      where: { id: metric.id },
      data: { maxDisplays: metric.maxDisplays - 1 }
    });
    // On diminue le maxd dans canBeBlessed
    await prismadb.canBeBlessed.updateMany({
      where: { nbrOfDisplays: 0 },
      data: { maxDisplays: metric.maxDisplays - 1 }
    })
    //
    revalidatePath("/dashboard/admin")
  }
}
// AUGMENTER
export async function increaseMaxDisplays() {
  const connected = await CurrentProfile()
  //
  const metric = await prismadb.metric.findFirst();
  if (!metric) return;

  if(connected && connected?.isActiveAccount && connected?.role === "USER") // admin en production
  {
    //
    await prismadb.metric.update({
      where: { id: metric.id },
      data: { maxDisplays: metric.maxDisplays + 1 }
    });
    // On augmente le maxd dans canBeBlessed
    await prismadb.canBeBlessed.updateMany({
      where: { nbrOfDisplays: 0 },
      data: { maxDisplays: metric.maxDisplays + 1 }
    })
    //
    revalidatePath("/dashboard/admin")
  }
}


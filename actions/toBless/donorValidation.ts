"use server";
//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
//
export async function donorBlessingValidation(listToBlessId: string) {
  if (!listToBlessId) return;
  // on select le amountId concerné
  const concerned = await prismadb.myListToBless.findFirst({
    where: {
      id: listToBlessId,
    }
  })
  //
  await prismadb.myListToBless.update({
    where: { id: listToBlessId },
    data: {
      donatorValidation: true,
    },
  });
//
  revalidatePath(`/dashboard/myRecipients/${concerned?.amountId}`);
  redirect(`/dashboard/myRecipients/${concerned?.amountId}`);
}

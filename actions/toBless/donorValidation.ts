"use server";

//
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function donorBlessingValidation(listToBlessId: string) {
  if (!listToBlessId) return;

  await prismadb.myListToBless.update({
    where: { id: listToBlessId },
    data: {
      donatorValidation: true,
    },
  });

  revalidatePath(`/dashboard/myRecipient/${listToBlessId}`);
  redirect(`/dashboard/myRecipient/${listToBlessId}`);
}

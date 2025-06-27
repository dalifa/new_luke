// actions/registerEmail.ts
"use server";

import { prismadb } from "@/lib/prismadb"; // adapte selon ton chemin
import { redirect } from "next/navigation";
import { ParrainageSchema } from "@/schemas";
import { CurrentProfile } from "@/hooks/own-current-user";
import { encrypt, hashed } from "@/lib/utils";

export const parrainage = async (formData: FormData) => {
  const connected = await CurrentProfile()
  const email = formData.get("email") as string;

  const validated = ParrainageSchema.safeParse({ email });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }
  //
  const encryptedEmail = encrypt(validated.data.email)
  const emailHashed = hashed(validated.data.email)
  //
  await prismadb.sponsorship.create({
    data: { 
      email: encryptedEmail,
      hashedEmail: emailHashed,
      parrainId: connected?.id 
    },
  });
  redirect("/dashboard/filleuls")
//
};

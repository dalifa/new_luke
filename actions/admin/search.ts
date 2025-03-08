"use server";

import { prismadb } from "@/lib/prismadb";

export const searchUser = async (query: string) => {
  const codepin = Number(query);

  if (isNaN(codepin)) {
    return [];
  }

  const users = await prismadb.profile.findMany({
    where: {
      codepin: codepin, // Recherche sur le champ `codepin`
    },
    select: {
      id: true,
      firstname: true,
      codepin: true,
    },
  });

  return users;
};
 

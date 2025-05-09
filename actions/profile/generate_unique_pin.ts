import { prismadb } from "@/lib/prismadb";

/**
 * Génère un codepin unique entre 1000 et 99999
 */
export const generateUniquePin = async (): Promise<number> => {
  const min = 1000;
  const max = 99999;

  let uniquePin: number;

  while (true) {
    const candidate = Math.floor(Math.random() * (max - min + 1)) + min;

    const exists = await prismadb.profile.findFirst({
      where: { codepin: candidate },
    });

    if (!exists) {
      uniquePin = candidate;
      break;
    }
  }

  return uniquePin;
};

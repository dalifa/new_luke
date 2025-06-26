import { CurrentProfile } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";

/**
 * Génère un donation number unique entre 1000 et 999999
 */
export const generateUniqueDonationNumber = async (): Promise<number> => {
  const connected = await CurrentProfile()
  const min = 1000;
  const max = 999999; 
  //TODO: faire en sorte que ce nobre soit liér au mois en cour
  /* donc le mois prochain on peut avoir le même nombre et c'est
  LE MOIS en cour qui distingue l'un de l'autre */

  let uniqueDonationNumber: number;

  while (true) {
    const candidate = Math.floor(Math.random() * (max - min + 1)) + min;
    // s'il est réellement dans une collecte où il n'a pas encore validé le don
    const exists = await prismadb.collectionParticipant.findFirst({
      where: { 
        participantId: connected?.id,
        donorValidation: true,
      },
    });

    if (!exists) {
      uniqueDonationNumber = candidate;
      break;
    }
  }

  return uniqueDonationNumber;
};

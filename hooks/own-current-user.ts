import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
//
export const currentUser = async () => {
  const session = await auth();
  //
  return session?.user;
};
//
export const CurrentProfile = async () => {
  //
  const session = await auth();
  // on select selon session
  const sessionInfos = await prismadb.user.findFirst({
    where: { email: session?.user?.email } 
  })
  //
  const profile = await prismadb.profile.findFirst({
    where: { hashedEmail: sessionInfos?.hashedEmail }
  })
  return profile
} 
//
// on select les amounts. la currency étant par defaut l'euro €
  export const AmountOne = async () => {
    const session = await auth();
    // on select selon session
    const sessionInfos = await prismadb.user.findFirst({
      where: { email: session?.user?.email } 
    })
    //
    const profile = await prismadb.profile.findFirst({
      where: { hashedEmail: sessionInfos?.hashedEmail }
    })
    const amountOne = await prismadb.amount.findFirst({
      where: { 
        rank: "one",
        currency: profile?.currency
     }
    })
    //
    return amountOne;
  };
  //
  export const amountTwo = async () => {
    const AmountTwo = await prismadb.amount.findFirst({
      where: { 
        rank: "two"
     }
    })
    //
    return AmountTwo;
  };
  //
  export const amountThree = async () => {
    const AmountThree = await prismadb.amount.findFirst({
      where: { 
        rank: "three"
     }
    })
    //
    return AmountThree;
  };
  //
  export const amountFour = async () => {
    const AmountFour = await prismadb.amount.findFirst({
      where: { 
        rank: "four"
     }
    })
    //
    return AmountFour;
  };
  //
  export const amountFive = async () => {
    const AmountFive = await prismadb.amount.findFirst({
      where: { 
        rank: "five"
     }
    })
    //
    return AmountFive;
  };
  //
  export const amountSix = async () => {
    const AmountSix = await prismadb.amount.findFirst({
      where: { 
        rank: "six"
     }
    })
    //
    return AmountSix;
  };
  //
  export const amountSeven = async () => {
    const AmountSeven = await prismadb.amount.findFirst({
      where: { 
        rank: "seven"
     }
    })
    //
    return AmountSeven;
  };
  //
// 
// pour affiche un nom avec la premiere lettre en Majuscule
export function capitalize(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

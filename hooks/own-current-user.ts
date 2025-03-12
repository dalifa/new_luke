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
    where: { googleEmail: sessionInfos?.email }
  })
  return profile
} 
//
// on select les amounts. la currency étant par defaut l'euro €
  export const AmountOne = async () => {
    const connected = await CurrentProfile();
    //
    const amountOne = await prismadb.amount.findFirst({
      where: { 
        rank: "one",
        currency: connected?.currency
     }
    })
    // 
    return amountOne;
  };
  //
  export const AmountTwo = async () => {
    const connected = await CurrentProfile();
    //
    const amountTwo = await prismadb.amount.findFirst({
      where: { 
        rank: "two",
        currency: connected?.currency
     }
    })
    //
    return amountTwo;
  };
  //
  export const AmountThree = async () => {
    const connected = await CurrentProfile();
    //
    const amountThree = await prismadb.amount.findFirst({
      where: { 
        rank: "three",
        currency: connected?.currency
     }
    })
    //
    return amountThree;
  };
  //
  export const AmountFour = async () => {
    const connected = await CurrentProfile();
    //
    const amountFour = await prismadb.amount.findFirst({
      where: { 
        rank: "four",
        currency: connected?.currency
     }
    })
    //
    return amountFour;
  };
  //
  export const AmountFive = async () => {
    const connected = await CurrentProfile();
    //
    const amountFive = await prismadb.amount.findFirst({
      where: { 
        rank: "five",
        currency: connected?.currency
     }
    })
    //
    return amountFive;
  };
  //
  export const AmountSix = async () => {
    const connected = await CurrentProfile();
    //
    const amountSix = await prismadb.amount.findFirst({
      where: { 
        rank: "six",
        currency: connected?.currency
     }
    })
    //
    return amountSix;
  };
// 
// pour affiche un nom avec la premiere lettre en Majuscule
export function capitalize(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

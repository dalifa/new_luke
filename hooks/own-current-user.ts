import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";

export const currentUser = async () => {
  const session = await auth();
  //
  return session?.user;
};
//
export const currentUserInfos = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail: session?.user.email }
    })
    return profile
} 
//
export const connectedAmountOne = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail : session?.user.email }
    })
    //
    const amountOne = await prismadb.amount.findFirst({
        where: {
            rank: "one",
            currency: profile?.currency
        }
    })
    return amountOne
}
// 
export const connectedAmountTwo = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail : session?.user.email }
    })
    //
    const amountTwo = await prismadb.amount.findFirst({
        where: {
            rank: "two",
            currency: profile?.currency
        }
    })
    return amountTwo
}
// 
export const connectedAmountThree = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail : session?.user.email }
    })
    //
    const amountThree = await prismadb.amount.findFirst({
        where: {
            rank: "three",
            currency: profile?.currency
        }
    })
    return amountThree
}
//  
export const connectedAmountFour = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail : session?.user.email }
    })
    //
    const amountFour = await prismadb.amount.findFirst({
        where: {
            rank: "four",
            currency: profile?.currency
        }
    })
    return amountFour
}
// 
export const connectedAmountFive = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail : session?.user.email }
    })
    //
    const amountFive = await prismadb.amount.findFirst({
        where: {
            rank: "five",
            currency: profile?.currency
        }
    })
    return amountFive
}
// 
export const connectedAmountSix = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail : session?.user.email }
    })
    //
    const amountSix = await prismadb.amount.findFirst({
        where: {
            rank: "six",
            currency: profile?.currency
        }
    })
    return amountSix
}
// 
export const connectedAmountSeven = async () => {
    const session = await auth();
    //
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail : session?.user.email }
    })
    //
    const amountSeven = await prismadb.amount.findFirst({
        where: {
            rank: "seven",
            currency: profile?.currency
        }
    })
    return amountSeven
}
// 


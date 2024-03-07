import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentUserInfos = async () => {
    const session = await auth();
    //
    const user = await prismadb.user.findFirst({
        where: { email: session?.user.email }
    })
    const profile = await prismadb.profile.findFirst({
        where: { googleEmail: user?.email }
    })
    return profile
} 

// 
export const theThirdAmount = async () => {
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

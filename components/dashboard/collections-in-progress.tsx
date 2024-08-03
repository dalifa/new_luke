
import { prismadb } from "@/lib/prismadb";
import { ScrollArea } from "../ui/scroll-area";
import { auth } from "@/auth";

export const CollectionsInProgress = async () => {
  const session = await auth();
  const profile = await prismadb.profile.findFirst({
    where: { googleEmail : session?.user.email }
  })
  const myAmountOne = await prismadb.amount.findFirst({
    where: {
      rank: "one",
      currency: profile?.currency
    }
  })
  const myAmountTwo = await prismadb.amount.findFirst({
    where: {
      rank: "two",
      currency: profile?.currency
    }
  }) 
  const myAmountThree = await prismadb.amount.findFirst({
    where: {
      rank: "three",
      currency: profile?.currency
    }
  })
  const myAmountFour = await prismadb.amount.findFirst({
    where: {
      rank: "four",
      currency: profile?.currency
    }
  })
  const myAmountFive = await prismadb.amount.findFirst({
    where: {
      rank: "five",
      currency: profile?.currency
    }
  })
  const myAmountSix = await prismadb.amount.findFirst({
    where: {
      rank: "six",
      currency: profile?.currency
    }
  })
  const myAmountSeven = await prismadb.amount.findFirst({
    where: {
      rank: "seven",
      currency: profile?.currency
    }
  })
  // ######## totality #######
  const amountOneOpenTotalityCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "totality",
      amount: myAmountOne?.amount,
      isGroupComplete: false,
    }
  })
  const amountTwoOpenTotalityCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "totality",
      amount: myAmountTwo?.amount,
      isGroupComplete: false
    }
  })
  const amountThreeOpenTotalityCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "totality",
      amount: myAmountThree?.amount,
      isGroupComplete: false
    }
  })
  const amountFourOpenTotalityCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "totality",
      amount: myAmountFour?.amount,
      isGroupComplete: false
    }
  })
  const amountFiveOpenTotalityCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "totality",
      amount: myAmountFive?.amount,
      isGroupComplete: false
    }
  })
  const amountSixOpenTotalityCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "totality",
      amount: myAmountSix?.amount,
      isGroupComplete: false
    }
  })
  const amountSevenOpenTotalityCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "totality",
      amount: myAmountSeven?.amount,
      isGroupComplete: false
    }
  })
  //
  return (
    <div className='flex items-center flex-col w-full'>
      <ScrollArea>
      {/* ######## totality ######## */}
      {
        amountOneOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3 ">
            <span className="text-blue-500 font-medium">{amountOneOpenTotalityCollectionsCount} </span> collecte{amountOneOpenTotalityCollectionsCount > 1 && (<span>s</span>)} de {myAmountOne?.amount}{myAmountOne?.currency} en cours...</p>
        )
      }
      {
        amountTwoOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountTwoOpenTotalityCollectionsCount} </span> collecte{amountTwoOpenTotalityCollectionsCount > 1 && (<span>s</span>)} de {myAmountTwo?.amount}{myAmountTwo?.currency} en cours...</p>
        )
      }
      {
        amountThreeOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountThreeOpenTotalityCollectionsCount}</span> collecte{amountThreeOpenTotalityCollectionsCount > 1 && (<span>s</span>)} de {myAmountThree?.amount}{myAmountThree?.currency} en cours...</p>
        )
      }
      {
        amountFourOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountFourOpenTotalityCollectionsCount}</span> collecte{amountFourOpenTotalityCollectionsCount > 1 && (<span>s</span>)} de {myAmountFour?.amount}{myAmountFour?.currency} en cours...</p>
        )
      }
      {
        amountFiveOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountFiveOpenTotalityCollectionsCount}</span> collecte{amountFiveOpenTotalityCollectionsCount > 1 && (<span>s</span>)} de {myAmountFive?.amount}{myAmountFive?.currency} en cours...</p>
        )
      }{
        amountSixOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountSixOpenTotalityCollectionsCount}</span> collecte{amountSixOpenTotalityCollectionsCount > 1 && (<span>s</span>)} de {myAmountSix?.amount}{myAmountSix?.currency} en cours...</p>
        )
      }
      {
        amountSevenOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountSevenOpenTotalityCollectionsCount}</span> collecte{amountSevenOpenTotalityCollectionsCount > 1 && (<span>s</span>)} de {myAmountSeven?.amount}{myAmountSeven?.currency} en cours...</p>
        )
      }
      </ScrollArea>
    </div>
  ); 
};

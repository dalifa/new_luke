
import { 
  connectedAmountFive, 
  connectedAmountFour, 
  connectedAmountOne, 
  connectedAmountSeven, 
  connectedAmountSix, 
  connectedAmountThree, 
  connectedAmountTwo
 } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { ScrollArea } from "../ui/scroll-area";
import { auth } from "@/auth";

export const CollectionsInProgress = async () => {
  const session = await auth();
    //
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
    // 
    /*
  const myAmountOne = await connectedAmountOne();
  const myAmountTwo = await connectedAmountTwo();
  const myAmountThree = await connectedAmountThree();
  const myAmountFour = await connectedAmountFour();
  const myAmountFive = await connectedAmountFive();
  const myAmountSix = await connectedAmountSix();
  const myAmountSeven = await connectedAmountSeven() */
  //
  const amountOneOpenCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "snippet",
      amount: myAmountOne?.amount,
      isGroupComplete: false,
    }
  })
  const amountTwoOpenCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "snippet",
      amount: myAmountTwo?.amount,
      isGroupComplete: false
    }
  })
  const amountThreeOpenCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "snippet",
      amount: myAmountThree?.amount,
      isGroupComplete: false
    }
  })
  const amountFourOpenCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "snippet",
      amount: myAmountFour?.amount,
      isGroupComplete: false
    }
  })
  const amountFiveOpenCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "snippet",
      amount: myAmountFive?.amount,
      isGroupComplete: false
    }
  })
  const amountSixOpenCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "snippet",
      amount: myAmountSix?.amount,
      isGroupComplete: false
    }
  })
  const amountSevenOpenCollectionsCount = await prismadb.collectionList.count({
    where: { 
      collectionType: "snippet",
      amount: myAmountSeven?.amount,
      isGroupComplete: false
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
      {
        amountOneOpenCollectionsCount > 0 && (
          <p className="mb-3 text-sm">
            {amountOneOpenCollectionsCount} collecte{amountOneOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountOne?.amount}{myAmountOne?.currency} en cours</p>
        )
      }
      {
        amountTwoOpenCollectionsCount > 0 && (
          <p className="mb-3 text-sm">
            {amountTwoOpenCollectionsCount} collecte{amountTwoOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountTwo?.amount}{myAmountTwo?.currency} en cours</p>
        )
      }
      {
        amountThreeOpenCollectionsCount > 0 && (
          <p className="mb-3 text-sm">{amountThreeOpenCollectionsCount} collecte{amountThreeOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountThree?.amount}{myAmountThree?.currency} en cours</p>
        )
      }
      {
        amountFourOpenCollectionsCount > 0 && (
          <p className="mb-3 text-sm">{amountFourOpenCollectionsCount} collecte{amountFourOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountFour?.amount}{myAmountFour?.currency} en cours</p>
        )
      }
      {
        amountFiveOpenCollectionsCount > 0 && (
          <p className="mb-3 text-sm">{amountFiveOpenCollectionsCount} collecte{amountFiveOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountFive?.amount}{myAmountFive?.currency} en cours</p>
        )
      }{
        amountSixOpenCollectionsCount > 0 && (
          <p className="mb-3 text-sm">{amountSixOpenCollectionsCount} collecte{amountSixOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountSix?.amount}{myAmountSix?.currency} en cours</p>
        )
      }
      {
        amountSevenOpenCollectionsCount > 0 && (
          <p className="mb-3 text-sm">{amountSevenOpenCollectionsCount} collecte{amountSevenOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountSeven?.amount}{myAmountSeven?.currency} en cours</p>
        )
      }
      {/* ######## totality ######## */}
      {
        amountOneOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3 ">
            <span className="text-blue-500 font-medium">{amountOneOpenTotalityCollectionsCount} </span> collecte{amountOneOpenTotalityCollectionsCount > 1 && (<span>s</span>)} Totality de {myAmountOne?.amount}{myAmountOne?.currency} en cours...</p>
        )
      }
      {
        amountTwoOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountTwoOpenTotalityCollectionsCount} </span> collecte{amountTwoOpenTotalityCollectionsCount > 1 && (<span>s</span>)} Totality de {myAmountTwo?.amount}{myAmountTwo?.currency} en cours...</p>
        )
      }
      {
        amountThreeOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountThreeOpenTotalityCollectionsCount}</span> collecte{amountThreeOpenTotalityCollectionsCount > 1 && (<span>s</span>)} Totality de {myAmountThree?.amount}{myAmountThree?.currency} en cours...</p>
        )
      }
      {
        amountFourOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountFourOpenTotalityCollectionsCount}</span> collecte{amountFourOpenTotalityCollectionsCount > 1 && (<span>s</span>)} Totality de {myAmountFour?.amount}{myAmountFour?.currency} en cours...</p>
        )
      }
      {
        amountFiveOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountFiveOpenTotalityCollectionsCount}</span> collecte{amountFiveOpenTotalityCollectionsCount > 1 && (<span>s</span>)} Totality de {myAmountFive?.amount}{myAmountFive?.currency} en cours...</p>
        )
      }{
        amountSixOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountSixOpenTotalityCollectionsCount}</span> collecte{amountSixOpenTotalityCollectionsCount > 1 && (<span>s</span>)} Totality de {myAmountSix?.amount}{myAmountSix?.currency} en cours...</p>
        )
      }
      {
        amountSevenOpenTotalityCollectionsCount > 0 && (
          <p className="mb-3">
            <span className="text-blue-500 font-medium">{amountSevenOpenTotalityCollectionsCount}</span> collecte{amountSevenOpenTotalityCollectionsCount > 1 && (<span>s</span>)} Totality de {myAmountSeven?.amount}{myAmountSeven?.currency} en cours...</p>
        )
      }
      </ScrollArea>
    </div>
  ); 
};

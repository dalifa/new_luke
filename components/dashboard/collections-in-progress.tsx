"use client";

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

export const CollectionsInProgress = async () => {
  const myAmountOne = await connectedAmountOne()
  const myAmountTwo = await connectedAmountTwo()
  const myAmountThree = await connectedAmountThree()
  const myAmountFour = await connectedAmountFour()
  const myAmountFive = await connectedAmountFive()
  const myAmountSix = await connectedAmountSix()
  const myAmountSeven = await connectedAmountSeven()
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
  //
  return (
    <div className='flex items-center flex-col w-full'>
      <ScrollArea>
      {
        amountOneOpenCollectionsCount > 0 && (
          <p className="mb-2 text-sm">
            {amountOneOpenCollectionsCount} collecte{amountOneOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountOne?.amount}{myAmountOne?.currency} en cours</p>
        )
      }
      {
        amountTwoOpenCollectionsCount > 0 && (
          <p className="mb-2">
            {amountTwoOpenCollectionsCount} collecte{amountTwoOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountTwo?.amount}{myAmountTwo?.currency} en cours</p>
        )
      }
      {
        amountThreeOpenCollectionsCount > 0 && (
          <p className="mb-2">{amountThreeOpenCollectionsCount} collecte{amountThreeOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountThree?.amount}{myAmountThree?.currency} en cours</p>
        )
      }
      {
        amountFourOpenCollectionsCount > 0 && (
          <p className="mb-2">{amountFourOpenCollectionsCount} collecte{amountFourOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountFour?.amount}{myAmountFour?.currency} en cours</p>
        )
      }
      {
        amountFiveOpenCollectionsCount > 0 && (
          <p className="mb-2">{amountFiveOpenCollectionsCount} collecte{amountFiveOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountFive?.amount}{myAmountFive?.currency} en cours</p>
        )
      }{
        amountSixOpenCollectionsCount > 0 && (
          <p className="mb-2">{amountSixOpenCollectionsCount} collecte{amountSixOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountSix?.amount}{myAmountSix?.currency} en cours</p>
        )
      }
      {
        amountSevenOpenCollectionsCount > 0 && (
          <p className="mb-2">{amountSevenOpenCollectionsCount} collecte{amountSevenOpenCollectionsCount > 1 && (<span>s</span>)} snippet de {myAmountSeven?.amount}{myAmountSeven?.currency} en cours</p>
        )
      }
      </ScrollArea>
    </div>
  ); 
};

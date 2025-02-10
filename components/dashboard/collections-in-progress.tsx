
import { prismadb } from "@/lib/prismadb";
import { Card } from "../ui/card";
import { CurrentProfile } from "@/hooks/own-current-user";
import { auth } from "@/auth";
//
export const CollectionsInProgress = async () => {
  const session = await auth()
  const connected = await CurrentProfile()
  // LES MONTANTS SELON LA MONNAIE DU CONNECTÉ
  const amountOne = await prismadb.amount.findFirst({
    where: { 
      rank: "one",
      currency: connected?.currency
    }
  })
  const amountTwo = await prismadb.amount.findFirst({
    where: { 
      rank: "two",
      currency: connected?.currency
    }
  })
  const amountThree = await prismadb.amount.findFirst({
    where: { 
      rank: "three",
      currency: connected?.currency
    }
  })
  const amountFour = await prismadb.amount.findFirst({
    where: { 
      rank: "four",
      currency: connected?.currency
    }
  })
  const amountFive = await prismadb.amount.findFirst({
    where: { 
      rank: "five",
      currency: connected?.currency
    }
  })
  // Nbre de tripl en cours...
  const triplCount = await prismadb.collection.count({
    where: {
      collectionType: "tripl",
      isGroupComplete: false
    }
  })
  // OPEN TRIPL BY AMOUNT 
  const amountOneOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: amountTwo?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  const amountTwoOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: amountTwo?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  const amountThreeOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: amountThree?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  const amountFourOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: amountFour?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  const amountFiveOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: amountFive?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  // ###
  // 
  return (
    <Card className='bg-white shadow-blue-100 shadow-md p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-xl lg:text-lg'>
        Collectes en cours 
      </p>
      <hr className='w-full mb-2'/>
      <div className='bg-white z-10 flex items-center flex-col w-full text-slate-600 space-y-3'>
        { 
         // S'IL N'Y A ZERO COLLECTE TRIPL EN COURS...
         triplCount === 0 && ( <p>Aucune collecte Tripl en cours ...</p> )
        }
        {
          amountOneOpenTriplCount > 0 && (
            <p>
              <span className="text-blue-500 font-semibold">
                {amountOneOpenTriplCount} 
              </span> &nbsp; Tripl de {amountOne?.amount}{amountOne?.currency} en cours...
            </p>
          )
        }
        {
          amountTwoOpenTriplCount > 0 && (
            <p>
              <span className="text-blue-500 font-semibold">
                {amountTwoOpenTriplCount} 
              </span> &nbsp; Tripl de {amountTwo?.amount}{amountTwo?.currency} en cours...
            </p>
          )
        }
        {
          amountThreeOpenTriplCount > 0 && (
            <p>
              <span className="text-blue-500 font-semibold">
                {amountThreeOpenTriplCount} 
              </span> &nbsp; Tripl de {amountThree?.amount}{amountThree?.currency} en cours...
            </p>
          )
        }
        {
          amountFourOpenTriplCount > 0 && (
            <p>
              <span className="text-blue-500 font-semibold">
                {amountFourOpenTriplCount} 
              </span> &nbsp; Tripl de {amountFour?.amount}{amountFour?.currency} en cours...
            </p>
          )
        }
        {
          amountFiveOpenTriplCount > 0 && (
            <p>
              <span className="text-blue-500 font-semibold">
                {amountFiveOpenTriplCount} 
              </span> &nbsp; Tripl de {amountFive?.amount}{amountFive?.currency} en cours...
            </p>
          )
        }
      </div>
    </Card>
  ); 
};

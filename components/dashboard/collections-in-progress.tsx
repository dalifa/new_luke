
import { prismadb } from "@/lib/prismadb";
import { Card } from "../ui/card";
import { AmountFive, AmountFour, AmountOne, AmountSix, AmountThree, AmountTwo, CurrentProfile } from "@/hooks/own-current-user";
import { auth } from "@/auth";
//
export const CollectionsInProgress = async () => {
  const session = await auth()
  const connected = await CurrentProfile()
  // LES MONTANTS SELON LA MONNAIE DU CONNECTÉ
  const one = await AmountOne() 
  const two = await AmountTwo()
  const three = await AmountThree()
  const four = await AmountFour()
  const five = await AmountFive();
  const six = await AmountSix();
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
      amount: one?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
    }
  })
  const amountTwoOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: two?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
    }
  })
  const amountThreeOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: three?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
    }
  })
  const amountFourOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: four?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
    }
  })
  const amountFiveOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: five?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
    }
  })
  const amountSixOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: six?.amount, // la currency est déjà pris en compte
      isGroupComplete: false,
    }
  })
  // ###
  // 
  return (
    <Card className='bg-white shadow-blue-100 shadow-md p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-xl lg:text-lg'>
        Tripl en cours 
      </p>
      <hr className='w-full mb-2'/>
      <div className='bg-white z-10 flex items-center flex-col w-full text-slate-600 space-y-3'>
        { 
         // S'IL N'Y A ZERO COLLECTE TRIPL EN COURS...
         triplCount === 0 && ( <p>Aucun Tripl en cours ...</p> )
        }
        {
          amountOneOpenTriplCount > 0 && (
            <p>
              <span className="text-red-800 font-semibold">
                {amountOneOpenTriplCount} 
              </span> &nbsp; Tripl de {one?.amount}{one?.currency} en cours...
            </p>
          )
        }
        {
          amountTwoOpenTriplCount > 0 && (
            <p>
              <span className="text-red-800 font-semibold">
                {amountTwoOpenTriplCount} 
              </span> &nbsp; Tripl de {two?.amount}{two?.currency} en cours...
            </p>
          )
        }
        {
          amountThreeOpenTriplCount > 0 && (
            <p>
              <span className="text-red-800 font-semibold">
                {amountThreeOpenTriplCount} 
              </span> &nbsp; Tripl de {three?.amount}{three?.currency} en cours...
            </p>
          )
        }
        {
          amountFourOpenTriplCount > 0 && (
            <p>
              <span className="text-red-800 font-semibold">
                {amountFourOpenTriplCount} 
              </span> &nbsp; Tripl de {four?.amount}{four?.currency} en cours...
            </p>
          )
        }
        {
          amountFiveOpenTriplCount > 0 && (
            <p>
              <span className="text-red-800 font-semibold">
                {amountFiveOpenTriplCount} 
              </span> &nbsp; Tripl de {five?.amount}{five?.currency} en cours...
            </p>
          )
        }
        {
          amountSixOpenTriplCount > 0 && (
            <p>
              <span className="text-red-800 font-semibold">
                {amountSixOpenTriplCount} 
              </span> &nbsp; Tripl de {six?.amount}{six?.currency} en cours...
            </p>
          )
        }
      </div>
    </Card>
  ); 
};

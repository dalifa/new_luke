
import { prismadb } from "@/lib/prismadb";
import { ScrollArea } from "../ui/scroll-area";
import { auth } from "@/auth";
import { Card } from "../ui/card";
import { currentUserInfos } from "@/hooks/own-current-user";

export const CollectionsInProgress = async () => {
  const session = await auth()
  const profile:any = await currentUserInfos()
  //  combien de tril d'ouvertes il y a ?
  const triplCount = await prismadb.collection.count({
    where:{
      isGroupComplete: false
    }
  })
  // ######## totality #######
  const oneOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 1,
      isGroupComplete: false,
    }
  })
  //
  const twoOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 2,
      isGroupComplete: false,
    }
  })
  //
  const threeOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 5,
      isGroupComplete: false,
    }
  })
  //
  const fourOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 10,
      isGroupComplete: false,
    }
  })
  //
  const fiveOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 20,
      isGroupComplete: false,
    }
  })
  //
  const sixOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 50,
      isGroupComplete: false,
    }
  })
  //
  const sevenOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 100,  // => 100€
      isGroupComplete: false,
    }
  })
  // 
  return (
    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-black text-md lg:text-lg'>
        Tripl en cours
      </p>
      {/* */} 
      <div className='bg-white z-10 flex items-center flex-col w-full'>
        {
          triplCount === 0 && (
            <p className="text-slate-600">Aucun tripl en cours ...</p>
          )
        }
        {/* ######## totality ######## */}
        {
          oneOpenTriplCount > 0 && (
            <p className="mb-3 ">
              <span className="text-red-800 font-semibold">
                {oneOpenTriplCount} 
              </span> &nbsp; Tripl de 1€ en cours...
            </p>
          )
        }
        {/**/}
      {
        twoOpenTriplCount > 0 && (
          <p className="mb-3 ">
            <span className="text-red-800 font-semibold">
              {twoOpenTriplCount} 
            </span> &nbsp; Tripl de 2€ en cours...
          </p>
        )
      }
      {/**/}
      {
        threeOpenTriplCount > 0 && (
          <p className="mb-3 ">
            <span className="text-red-800 font-semibold">
              {threeOpenTriplCount} 
            </span> &nbsp; Tripl de 5€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fourOpenTriplCount > 0 && (
          <p className="mb-3 ">
            <span className="text-red-800 font-semibold">
              {fourOpenTriplCount} 
            </span>&nbsp; Tripl de 10€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fiveOpenTriplCount > 0 && (
          <p className="mb-3 ">
            <span className="text-red-800 font-semibold">
              {fiveOpenTriplCount} 
            </span> &nbsp; Tripl de 20€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sixOpenTriplCount > 0 && (
          <p className="mb-3 ">
            <span className="text-red-800 font-semibold">
              {sixOpenTriplCount} 
            </span> &nbsp; Tripl de 50€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sevenOpenTriplCount > 0 && (
          <p className="mb-3 ">
            <span className="text-red-800 font-semibold">
              {sevenOpenTriplCount} 
            </span> &nbsp; Tripl de 100€ en cours...
          </p>
        )
      }
      {/**/}
    </div>
    </Card>
  ); 
};


import { prismadb } from "@/lib/prismadb";
import { auth } from "@/auth";
import { Card } from "../ui/card";
import { currentUserInfos } from "@/hooks/own-current-user";

export const CollectionsInProgress = async () => {
  const session = await auth()
  const profile:any = await currentUserInfos()
  //
  const triplCount = await prismadb.collection.count({
    where: {
      collectionType: "tripl",
      isGroupComplete: false
    }
  })
  //
  const snippetsCount = await prismadb.collection.count({
    where: {
      collectionType: "snippets",
      isGroupComplete: false
    }
  })
  //
  const totalityCount = await prismadb.collection.count({
    where: {
      collectionType: "totality",
      isGroupComplete: false
    }
  })
  //
  const twoOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 2,
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  //
  const threeOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 5,
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  //
  const fourOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 10,
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  //
  const fiveOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 20,
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  //
  const sixOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 50,
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  //
  const sevenOpenTriplCount = await prismadb.collection.count({
    where: { 
      amount: 100,  // => 100€
      isGroupComplete: false,
      collectionType: "tripl"
    }
  })
  // ###
  const twoOpenSnippetsCount = await prismadb.collection.count({
    where: { 
      amount: 2,
      isGroupComplete: false,
      collectionType: "snippets"
    }
  })
  //
  const threeOpenSnippetsCount = await prismadb.collection.count({
    where: { 
      amount: 5,
      isGroupComplete: false,
      collectionType: "snippets"
    }
  })
  //
  const fourOpenSnippetsCount = await prismadb.collection.count({
    where: { 
      amount: 10,
      isGroupComplete: false,
      collectionType: "snippets"
    }
  })
  //
  const fiveOpenSnippetsCount = await prismadb.collection.count({
    where: { 
      amount: 20,
      isGroupComplete: false,
      collectionType: "snippets"
    }
  })
  //
  const sixOpenSnippetsCount = await prismadb.collection.count({
    where: { 
      amount: 50,
      isGroupComplete: false,
      collectionType: "snippets"
    }
  })
  //
  const sevenOpenSnippetsCount = await prismadb.collection.count({
    where: { 
      amount: 100,  // => 100€
      isGroupComplete: false,
      collectionType: "snippets"
    }
  })
  //  ##
  const twoOpenTotalityCount = await prismadb.collection.count({
    where: { 
      amount: 2,
      isGroupComplete: false,
      collectionType: "totality"
    }
  })
  //
  const threeOpenTotalityCount = await prismadb.collection.count({
    where: { 
      amount: 5,
      isGroupComplete: false,
      collectionType: "totality"
    }
  })
  //
  const fourOpenTotalityCount = await prismadb.collection.count({
    where: { 
      amount: 10,
      isGroupComplete: false,
      collectionType: "totality"
    }
  })
  //
  const fiveOpenTotalityCount = await prismadb.collection.count({
    where: { 
      amount: 20,
      isGroupComplete: false,
      collectionType: "totality"
    }
  })
  //
  const sixOpenTotalityCount = await prismadb.collection.count({
    where: { 
      amount: 50,
      isGroupComplete: false,
      collectionType: "totality"
    }
  })
  //
  const sevenOpenTotalityCount = await prismadb.collection.count({
    where: { 
      amount: 100,  // => 100€
      isGroupComplete: false,
      collectionType: "totality"
    }
  })
  // 4 TEST
  const currentFakeProfile= await prismadb.currentProfileForTest.findFirst()
  // fake profile infos
  const fakeProfile = await prismadb.profile.findFirst({
    where: { usercodepin: currentFakeProfile?.usercodepin}
  })
  // 
  return (
    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-600 text-md lg:text-lg'>
        Collectes en cours
      </p>
      <hr className='w-full mb-2'/>
      <div className='bg-white z-10 flex items-center flex-col w-full text-slate-600 space-y-3'>
      {/* 4 TEST */}  
      <p>current fake: {fakeProfile?.username} - {fakeProfile?.usercodepin}</p>
      <p>credit: <span className="font-semibold text-green-600">{fakeProfile?.credit}</span>{fakeProfile?.currency}</p>
      <p>jackpot: {fakeProfile?.jackpot}{fakeProfile?.currency}</p>
      {/* AND 4 TEST*/}  
       {/*  { triplCount === 0 && ( <p>Aucune collecte tripl en cours ...</p> )}  */}
        {/* ######## tripl ######## */}
      {
        twoOpenTriplCount > 0 && (
          <p>
            <span className="text-red-800 font-semibold">
              {twoOpenTriplCount} 
            </span> &nbsp; Tripl de 2€ en cours...
          </p>
        )
      }
      {/**/}
      {
        threeOpenTriplCount > 0 && (
          <p>
            <span className="text-red-800 font-semibold">
              {threeOpenTriplCount} 
            </span> &nbsp; Tripl de 5€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fourOpenTriplCount > 0 && (
          <p>
            <span className="text-red-800 font-semibold">
              {fourOpenTriplCount} 
            </span>&nbsp; Tripl de 10€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fiveOpenTriplCount > 0 && (
          <p>
            <span className="text-red-800 font-semibold">
              {fiveOpenTriplCount} 
            </span> &nbsp; Tripl de 20€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sixOpenTriplCount > 0 && (
          <p>
            <span className="text-red-800 font-semibold">
              {sixOpenTriplCount} 
            </span> &nbsp; Tripl de 50€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sevenOpenTriplCount > 0 && (
          <p>
            <span className="text-red-800 font-semibold">
              {sevenOpenTriplCount} 
            </span> &nbsp; Tripl de 100€ en cours...
          </p>
        )
      }
      {/*
      {
        snippetsCount === 0 && (
          <p>Aucune collecte Snippets en cours ...</p>
        )
      } */}
      {
        twoOpenSnippetsCount > 0 && (
          <p>
            <span className="text-violet-600 font-semibold">
              {twoOpenSnippetsCount} 
            </span> &nbsp; collectes Snippets de 2€ en cours...
          </p>
        )
      }
      {/**/}
      {
        threeOpenSnippetsCount > 0 && (
          <p>
            <span className="text-violet-600 font-semibold">
              {threeOpenSnippetsCount} 
            </span> &nbsp; collectes Snippets de 5€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fourOpenSnippetsCount > 0 && (
          <p>
            <span className="text-violet-600 font-semibold">
              {fourOpenSnippetsCount} 
            </span>&nbsp; collectes Snippets de 10€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fiveOpenSnippetsCount > 0 && (
          <p>
            <span className="text-violet-600 font-semibold">
              {fiveOpenSnippetsCount} 
            </span> &nbsp; collectes Snippets de 20€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sixOpenSnippetsCount > 0 && (
          <p>
            <span className="text-violet-600 font-semibold">
              {sixOpenSnippetsCount} 
            </span> &nbsp; collectes Snippets de 50€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sevenOpenSnippetsCount > 0 && (
          <p>
            <span className="text-violet-600 font-semibold">
              {sevenOpenSnippetsCount} 
            </span> &nbsp; collectes Snippets de 100€ en cours...
          </p>
        )
      }
      {/* {
        totalityCount === 0 && (
          <p>Aucune collecte Totality en cours ...</p>
        )
      } */}
      {/* ######## totality ######## */}
      {
        twoOpenTotalityCount > 0 && (
          <p>
            <span className="text-blue-500 font-semibold">
              {twoOpenTriplCount} 
            </span> &nbsp; collectes Totality de 2€ en cours...
          </p>
        )
      }
      {/**/}
      {
        threeOpenTotalityCount > 0 && (
          <p>
            <span className="text-blue-500 font-semibold">
              {threeOpenTotalityCount} 
            </span> &nbsp; collectes Totality de 5€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fourOpenTotalityCount > 0 && (
          <p>
            <span className="text-blue-500 font-semibold">
              {fourOpenTriplCount} 
            </span>&nbsp; collectes Totality de 10€ en cours...
          </p>
        )
      }
      {/**/}
      {
        fiveOpenTotalityCount > 0 && (
          <p>
            <span className="text-blue-500 font-semibold">
              {fiveOpenTriplCount} 
            </span> &nbsp; collectes Totality de 20€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sixOpenTotalityCount > 0 && (
          <p>
            <span className="text-blue-500 font-semibold">
              {sixOpenTotalityCount} 
            </span> &nbsp; collectes Totality de 50€ en cours...
          </p>
        )
      }
      {/**/}
      {
        sevenOpenTotalityCount > 0 && (
          <p>
            <span className="text-blue-500 font-semibold">
              {sevenOpenTotalityCount} 
            </span> &nbsp; collectes Totality de 100€ en cours...
          </p>
        )
      }
      {/**/}
    </div>
    </Card>
  ); 
};

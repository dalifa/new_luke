// ÇA MARCHE
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { currentUserInfos } from "@/hooks/own-current-user";

//
export async function POST(req: Request) {
  try {
    const { rate } = await req.json();

    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!rate) {
        return new NextResponse("username is required", { status: 400 });
    }
    // 
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
      // Activity Registration
      await prismadb.activity.create({
        data: {
          author: connectedUser?.usercodepin, // Int
          activity:  "création du pourcentage de commission de Luke638" , // String
        }
      })
     //
      const addRate = await prismadb.commissionRate.create({
        data: {
          rate: rate
        }
      });
      return NextResponse.json(addRate);
    }
    
  } catch (error) {
    console.log("[RATE_COMMISSION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//
// UPDATE METRIC
export async function PATCH(req: Request) {
  try {
    const { rate } = await req.json();
    const session = await auth();
    const connected = await currentUserInfos()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // 
    const connectedUser = await currentUserInfos()
    // #### ddc #### 
    /*
  await prismadb.collection.create({
    data: {
      amount: 100,
      currency: "€",
      collectionType: "ddc",
      groupStatus: 1,
    }
  })
  //
  const justcreated = await prismadb.collection.findFirst({
    where: {
      amount: 100,
      collectionType: "ddc"
    }
  })
  //
  if(justcreated && connected)
  {
    await prismadb.ddcParticipants.create({
      data: {
        ddcCollectionId: justcreated?.id,
        doneeId: connected?.id,
      }
    })
  } */
  // ##### fin ####
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
      // Activity Registration
      await prismadb.activity.create({
        data: {
          author: connectedUser?.usercodepin,
          activity:  "update du pourcentage de commission de luke638" , // String
        }
      })
      //
      const updatedRate = await prismadb.commissionRate.updateMany({
        data: {
          rate: rate
        }
      });
      return NextResponse.json(updatedRate);
    }
    //
  } catch (error) {
    console.log("[UPDATE_RATE_COMMISSION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

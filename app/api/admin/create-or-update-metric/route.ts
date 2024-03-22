// ÇA MARCHE
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";

//
export async function POST(req: Request) {
  try {
    const { currentgroup, currentNbrOfCollection } = await req.json();

    const session = await auth(); 

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!currentgroup) {
        return new NextResponse("username is required", { status: 400 });
    }
    if (!currentNbrOfCollection) {
      return new NextResponse("firstname is required", { status: 400 });
    }
    //
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
      // Activity Registration
      await prismadb.activity.create({
        data: {
          usercodepin: connectedUser?.usercodepin, // Int
          activity:  "création de currentGroup et currentNbrOfCollection", // String
          concerned: "Admin action"  , // Json?
          action:    "créer" // Json?
        }
      })
      //
      const addMetric = await prismadb.metric.create({
        data: {
          currentgroup,
          currentNbrOfCollection,
        }
      });
      return NextResponse.json(addMetric);
    }
    
  } catch (error) {
    console.log("[ADD_METRIC_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//
// UPDATE METRIC
export async function PATCH(req: Request) {
  try {
    const { currentgroup, currentNbrOfCollection } = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    //
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
     // Activity Registration
      await prismadb.activity.create({
        data: {
          usercodepin: connectedUser?.usercodepin, // Int
          activity:  "update de currentGroup ou currentNbrOfCollection" , // String
          concerned: "Admin action"  , // Json?
          action: "nouveau currentGroup: " + currentgroup + " et currentNbrOfCollection " + currentNbrOfCollection // Json?
        }
      })
      //
      const updatedMetric = await prismadb.metric.updateMany({
        data: {
          currentgroup,
          currentNbrOfCollection,
        }
      });
      return NextResponse.json(updatedMetric);
    }
    //
  } catch (error) {
    console.log("[UPDATE_METRIC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

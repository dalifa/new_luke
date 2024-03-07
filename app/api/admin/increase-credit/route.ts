// ÇA MARCHE

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";


// UPDATE METRIC
export async function PATCH(req: Request) {
  try {
    const { userLukeCode, amountToAdd } = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    //
    if (!userLukeCode) {
      return new NextResponse("username is required", { status: 400 });
    }
    if (!amountToAdd) {
      return new NextResponse("username is required", { status: 400 });
    }
    //
    const user = await prismadb.profile.findFirst({
      where: { usercodepin: userLukeCode }
    })
    //
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
      await prismadb.activity.create({
        data: {
          usercodepin: connectedUser?.usercodepin, // Int
          activity:  "update de credit à la hausse " , // String
          concerned: "Admin action"  , // Json?
          action: "nouveau credit de : " + userLukeCode + " est de " + user?.credit + " + " + amountToAdd // Json?
        }
      })
      //
      const updatedUserCredit = await prismadb.profile.updateMany({
        where:{ usercodepin: userLukeCode },
        data: {
          credit: user?.credit + amountToAdd
        }
      });
      return NextResponse.json(updatedUserCredit);
    }
    //
  } catch (error) {
    console.log("[UPDATE_CREDIT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

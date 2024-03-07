// ÇA MARCHE

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";


// UPDATE 
export async function PATCH(req: Request) {
  try {
    const { usercodepin } = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    //
    if (!usercodepin) {
      return new NextResponse("code pin is required", { status: 400 });
    }
    //
    const user = await prismadb.profile.findFirst({
      where: { usercodepin } // ou usercodepin: usercodepin
    })
    //
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // en prod
    {
      await prismadb.activity.create({
        data: {
          usercodepin: connectedUser?.usercodepin, // Int
          activity:  "inactivation de compte " , // String
          concerned: "action de Admin: " + connectedUser?.usercodepin , // Json?
          action: "le compte de : " + user?.usercodepin + " dont mail =  " + user?.googleEmail + "est désormais inactif."// Json?
        }
      })
      //
      const unactivate = await prismadb.profile.updateMany({
        where:{ usercodepin: user?.usercodepin },
        data: {
          isActiveAccount: false
        }
      });
      return NextResponse.json(unactivate);
    }
    // 
  } catch (error) {
    console.log("[UNACTIVATE_ACCOUNT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

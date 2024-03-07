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
      return new NextResponse("username is required", { status: 400 });
    }
    // le membre dont le compte est à réactiver
    const user = await prismadb.profile.findFirst({
      where: { usercodepin: usercodepin }
    })
    //
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // en prod
    {
      await prismadb.activity.create({
        data: {
          usercodepin: connectedUser?.usercodepin, // Int
          activity:  "réactivation de compte" , // String
          concerned: "Admin concerné: " + connectedUser.usercodepin  , // Json?
          action: "membre dont le compte à été réactivé: " + user?.usercodepin + ", son email: " + user?.googleEmail + "."  // Json?
        }
      })
      //
      const reactivate = await prismadb.profile.updateMany({
        where:{ 
          usercodepin: user?.usercodepin,
         },
        data: {
          isActiveAccount: true
        }
      });
      return NextResponse.json(reactivate);
    }
    //
  } catch (error) {
    console.log("[REACTIVATE_ACCOUNT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

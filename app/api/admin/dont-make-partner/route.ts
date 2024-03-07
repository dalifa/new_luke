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
    // membre qui ne va plus être partner
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
          activity:  " ne plus rendre un membre partner " , // String
          concerned: "Action de Admin: " + connectedUser?.usercodepin  , // Json?
          action: "le membre : " + user?.usercodepin + " dont le mail est: " + user?.googleEmail + " n'est plus partner" // Json?
        }
      })
      // 
      const notpartner = await prismadb.profile.updateMany({
        where:{ usercodepin: user?.usercodepin },
        data: {
          isPartner: false
        }
      });
      return NextResponse.json(notpartner);
    }
    //
  } catch (error) {
    console.log("[DONT_MAKE_PARTNER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

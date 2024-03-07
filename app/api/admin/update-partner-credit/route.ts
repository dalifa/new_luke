// ÇA MARCHE

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// UPDATE
export async function PATCH(req: Request) {
  try {
    const { usercodepin, amountToAdd } = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    //
    if (!usercodepin) {
      return new NextResponse("username is required", { status: 400 });
    }
    if (!amountToAdd) {
      return new NextResponse("username is required", { status: 400 });
    }
    //
    const user = await prismadb.profile.findFirst({
      where: { usercodepin: usercodepin }
    })
    //
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
      await prismadb.activity.create({
        data: {
          usercodepin: connectedUser?.usercodepin, // Int
          activity:  "update de credit partner " , // String
          concerned: "action de Admin : " + connectedUser.usercodepin  , // Json?
          action: "nouveau credit partner de : " + user?.usercodepin + " dont le mail est " + user?.googleEmail + ". son nouveau credit partner est " + (amountToAdd + user?.partnerCredit) // Json?
        }
      })
      // 
      const updatedPartnerCredit = await prismadb.profile.updateMany({
        where:{ usercodepin: user?.usercodepin },
        data: {
          partnerCredit: user?.partnerCredit + amountToAdd
        }
      });
      return NextResponse.json(updatedPartnerCredit);
    }
    //
  } catch (error) {
    console.log("[UPDATE_PARTNER_CREDIT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

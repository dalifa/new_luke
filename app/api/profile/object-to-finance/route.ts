// ÇA MARCHE
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";

//
export async function POST(req: Request) {
  try {
    const { objectToFinanceId } = await req.json();

    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!objectToFinanceId) {
        return new NextResponse("object is required", { status: 400 });
    }
    // le pays choisi
    const chosenObject = await prismadb.toFinance.findFirst({
        where: { id: objectToFinanceId }
    })
    // connectedUser
    const connectedUser = await currentUserInfos()
    // Activity Registration
    await prismadb.activity.create({
      data: {
        usercodepin: connectedUser?.usercodepin,   // en prod
        activity:  "création du projet à faire financer.", // String
        concerned: "le concerné: " + connectedUser?.googleEmail, // Json?
        action: "objet choisi: " + chosenObject?.objectName  // Json?
      }
    })
    //
    const myProjectToFinance = await prismadb.myObject.create({
      data: {
        googleEmail: connectedUser?.googleEmail,
        usercodepin: connectedUser?.usercodepin,
        objectToFinanceId,
      }
    });
    return NextResponse.json(myProjectToFinance);
    
  } catch (error) {
    console.log("[CREATE_OBJECT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
//
// UPDATE PROFILE INFOS
export async function PATCH(req: Request) {
  try {
    const { objectToFinanceId } = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Activity Registration
    const connectedUser = await currentUserInfos()
    //
    const chosenObject = await prismadb.toFinance.findFirst({
      where: { id: objectToFinanceId }
    })
    //
    await prismadb.activity.create({
      data: {
        usercodepin: connectedUser?.usercodepin,   // en prod
        activity:  "update du projet à faire financer.", // String
        concerned: connectedUser?.googleEmail, // Json?
        action: "Nouvel objet à faire financer: " + chosenObject?.objectName  // Json?
      }
    })
    //
    const updatedProjectToFinance = await prismadb.myObject.updateMany({
      where: { googleEmail: connectedUser?.googleEmail },
      data: {
        googleEmail: connectedUser?.googleEmail,
        usercodepin: connectedUser?.usercodepin,
        objectToFinanceId,
      }
    });
    return NextResponse.json(updatedProjectToFinance);
    
  } catch (error) {
    console.log("[UPDATE_OBJECT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

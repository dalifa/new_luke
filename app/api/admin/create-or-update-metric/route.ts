// ÇA MARCHE
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";

//
export async function POST(req: Request) {
  try {
    const { currentgroup, currentNbrOfTripl, currentDdcGroup } = await req.json();

    const session = await auth(); 

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!currentgroup) {
        return new NextResponse("username is required", { status: 400 });
    }
    if (!currentNbrOfTripl) {
      return new NextResponse("firstname is required", { status: 400 });
    }
    //
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
      // TODO: Activity Registration
      
      //
      const addMetric = await prismadb.metric.create({
        data: {
          currentgroup,
          currentNbrOfTripl,
          currentDdcGroup
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
    const { currentgroup, currentNbrOfTripl, currentDdcGroup } = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    //
    const connectedUser = await currentUserInfos()
    //
    //if(connectedUser?.role === "ADMIN") // mettre admin en prod
    //{
      // TODO: Activity Registration
      
      // #### 
      // On vérifie si le currentDdcGroup entré est inférieur à l'existant
      const metric = await prismadb.metric.findFirst()
      //
      if(metric && currentDdcGroup >= metric?.currentDdcGroup)
      {
        // ON update le groupPlus de toutes les ddc ouvertes
        await prismadb.collection.updateMany({
          where: { 
            isGroupComplete: true,
            isCollectionClosed: false,
          },
          data: { groupPlus: currentDdcGroup }
        })
        // la collecte en construction auront group = groupPlus
        await prismadb.collection.updateMany({
          where: { 
            isGroupComplete: false,
            isCollectionClosed: false,
          },
          data: { 
            group: currentDdcGroup,
            groupPlus: currentDdcGroup,
          }
        })
        //
        const updatedMetric = await prismadb.metric.updateMany({
          data: {
            currentgroup,
            currentNbrOfTripl,
            currentDdcGroup
          }
        });
        return NextResponse.json(updatedMetric);
      }
      //
      if(metric && currentDdcGroup < metric?.currentDdcGroup)
      {
        const updated = await prismadb.metric.updateMany({
          data: {
            currentgroup,
            currentNbrOfTripl,
            //currentDdcGroup: metric?.currentDdcGroup
          }
        });
        //
        return NextResponse.json(updated);
      }
    //}
    //
  } catch (error) {
    console.log("[UPDATE_METRIC_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

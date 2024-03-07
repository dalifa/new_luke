// ÇA MARCHE
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { currentUserInfos } from "@/hooks/own-current-user";

// 
export async function POST(req: Request) {
  try {
    const { amount, currency, rank } = await req.json();

    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!amount) {
        return new NextResponse("amount is required", { status: 400 });
    }
    if (!currency) {
      return new NextResponse("currency is required", { status: 400 });
    }
    if (!rank) {
      return new NextResponse("rank is required", { status: 400 });
    }
    // 
    const connectedUser = await currentUserInfos()
    //
    if(connectedUser?.role === "ADMIN") // mettre admin en prod
    {
      // Activity Registration
      await prismadb.activity.create({
        data: {
          usercodepin: connectedUser?.usercodepin, // Int auteur de l'activité
          activity:  "ajoût d'une somme" , // String
          concerned: "Admin action"  , // Json?
          action: "admin a ajouté la somme de : " + amount + currency + " de rang " + rank   // Json?
        }
      })
     //
      const addAmount = await prismadb.amount.create({
        data: {
          amount: amount,
          currency: currency,
          rank: rank
        }
      });
      return NextResponse.json(addAmount);
    }
    
  } catch (error) {
    console.log("[ADD_AMOUNT_BY_CURRENCY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
//
// ÇA MARCHE

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Add country 
export async function POST( req: Request ) {
  try{
      const body = await req.json();
  
      const { name, currency, usezone } = body;
  
      const session = await auth();
  
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      // les champs optionnel n'ont pas besoin de vérification
      if (!name) {
        return new NextResponse("name is required", { status: 400 });
      }
      if (!currency) {
        return new NextResponse("currency is required", { status: 400 });
      }  
      if (!usezone) {
        return new NextResponse("usezone is required", { status: 400 });
      }  
      // on vérifie que celui qui modifie est un ADMIN
      const connectedUser = await currentUserInfos()
      //
      if(connectedUser?.role === "ADMIN") // mettre admin en prod
      {
        // Activity Registration
        await prismadb.activity.create({
          data: {
            usercodepin: connectedUser?.usercodepin, // Int
            activity:  "ajoût d'un pays dans la table country" , // String
            concerned: "Admin action"  , // Json?
            action: "nom: " + name + " monnaie: " + currency + "use zone: " + usezone  // Json?
          }
        })
        // country added
        const newcountry = await prismadb.country.create({
            data: {
              name,
              currency,
              usezone: usezone,
            }
        }) 
        return NextResponse.json(newcountry);
      }
      else{
        return new NextResponse("You are not an ADMIN", { status: 400 });
      }
  
    } catch (error) {
      console.log('[ADD_COUNTRY_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
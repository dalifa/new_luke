// ÇA MARCHE

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// Add country 
export async function POST( req: Request ) {
  try{
      const body = await req.json();
  
      const { username, phone, firstname, lastname, city, bio  } = body;
  
      const session = await auth();
  
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      // les champs optionnel n'ont pas besoin de vérification
      if (!username) {
        return new NextResponse("name is required", { status: 400 });
      }
      //
      const connectedUser = await currentUserInfos()
      const profileCount = await prismadb.profile.count()
      // country added
      const newcountry = await prismadb.profile.create({
          data: {
            username,
            usercodepin: profileCount + 1000 + 1,
            phone, 
            firstname,    
            lastname,    
            city,
            countryId: "65988254ef3d78f14d98c0ff",
            bio 
          }
        }) 
        return NextResponse.json(newcountry);
  
    } catch (error) {
      console.log('[ADD_COUNTRY_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
// ÇA MARCHE

import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

//
export async function POST( req: Request ) {
  try{
      const body = await req.json();
  
      const { amount, cent1, cent2, byten } = body;
  
      const session = await auth();
  
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      // les champs optionnel n'ont pas besoin de vérification
      if (!amount) {
        return new NextResponse("lukecode is required", { status: 400 });
      }
      if (!cent1) {
        return new NextResponse("cent1 is required", { status: 400 });
      }
      if (!cent2) {
        return new NextResponse("cent2 is required", { status: 400 });
      }
      if (!byten) {
        return new NextResponse("byten is required", { status: 400 });
      }
      // on crée des centimes de 0,1 à 0,99
      const newCents = await prismadb.cents.create({
        data: {
          amount,
          cent1,
          cent2,
          byten
        }
      })  
      return NextResponse.json(newCents);

    } catch (error) {
      console.log('[CREATE_CENTS_POST]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
// ÇA MARCHE
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";

//
export async function POST(req: Request) {
  try {
    const { godSonPhone, secretCode, countryId } = await req.json();

    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!godSonPhone) {
        return new NextResponse("username is required", { status: 400 });
    }
    if (!secretCode) {
      return new NextResponse("firstname is required", { status: 400 });
    }
    if (!countryId) {
      return new NextResponse("lastname is required", { status: 400 });
    }
    // le pays choisi
    const chosenCountry = await prismadb.country.findFirst({
        where: { id: countryId }
    })
    // connected profil
    const connected = await prismadb.profile.findFirst({
        where: { googleEmail: session?.user.email }
    })
    // on verifie si ce numero , du pays choisi n'existe pas déjà ?
    const verifCount = await prismadb.referralCode.count({
        where: {
            godSonPhone,
            country: chosenCountry?.name
        }
    })
    if(verifCount < 1)
    {
      // Activity Registration
      await prismadb.activity.create({
        data: {
          usercodepin: 0,   // en prod
          activity:  "parrainage.", // String
          concerned: "author: " + connected?.lastname + " phone: " + connected?.phone + " country: " + connected?.city + " email:" + session?.user?.email, // Json?
          action: "code: " + secretCode + " phone: " + godSonPhone + " country: " + chosenCountry?.name + "."  // Json?
        }
      })
      //
      const sponsorCode = await prismadb.referralCode.create({
        data: {
          godFatherEmail: session?.user.email,
          godFatherCodepin: connected?.usercodepin,
          godSonPhone,
          secretCode,
          country: chosenCountry?.name
        }
      });
      return NextResponse.json(sponsorCode);
    }else{
      return new NextResponse("Numéro déjà enregistré", { status: 400 });
    }
    
  } catch (error) {
    console.log("[SPONSOR_CODE_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
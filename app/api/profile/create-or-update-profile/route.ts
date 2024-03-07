// ÇA MARCHE
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { currentUserInfos } from "@/hooks/own-current-user";

//
export async function POST(req: Request) {
  try {
    const { username, phone, firstname, lastname, city, countryId, bio } = await req.json();

    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!username) {
        return new NextResponse("username is required", { status: 400 });
    }
    if (!firstname) {
      return new NextResponse("firstname is required", { status: 400 });
    }
    if (!lastname) {
      return new NextResponse("lastname is required", { status: 400 });
    }
    if (!phone) {
      return new NextResponse("church is required", { status: 400 });
    }
    if (!city) {
      return new NextResponse("city is required", { status: 400 });
    }
    if (!countryId) {
      return new NextResponse("country is required", { status: 400 });
    }
    if (!bio) {
      return new NextResponse("bio is required", { status: 400 });
    }
    // le pays choisi
    const chosenCountry = await prismadb.country.findFirst({
        where: { id: countryId }
    })
    // on calcul le lukecode: nbre de profile + 1000
    const profileCount = await prismadb.user.count()
    // Activity Registration
    await prismadb.activity.create({
      data: {
        usercodepin: (profileCount + 1000),   // en prod
        activity:  "création de profile.", // String
        concerned: "le concerné: " + session?.user?.email, // Json?
        action: "Profil crée: " + username + " " + phone + " " + firstname + " " + lastname + " de " + city + ". Sa monnaie: " + chosenCountry?.currency  // Json?
      }
    })
    //
    const userProfile = await prismadb.profile.create({
      data: {
        googleEmail: session?.user?.email,
        usercodepin: profileCount + 1000,
        username,
        phone,
        firstname,
        lastname,
        city,
        countryId,
        bio,
        currency: chosenCountry?.currency
      }
    });
    return NextResponse.json(userProfile);
    
  } catch (error) {
    console.log("[UPDATE_USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

//
// UPDATE PROFILE INFOS
export async function PATCH(req: Request) {
  try {
    const { username, phone, firstname, lastname, city, countryId, bio } = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // le pays choisi
    const chosenCountry = await prismadb.country.findFirst({
      where: { id: countryId }
    })
    // Activity Registration
    const currentUser = await currentUserInfos()
    //
    await prismadb.activity.create({
      data: {
        usercodepin: currentUser?.usercodepin,   // en prod
        activity:  "update de profile.", // String
        concerned: session.user.email, // Json?
        action: "le connecté a updaté son profil: " + username + ", " + phone + ", " + firstname + ", " + lastname + " de " + city + ". Sa monnaie: " + chosenCountry?.currency  // Json?
      }
    })
    //
    const updatedProfile = await prismadb.profile.updateMany({
      where: { googleEmail: session?.user?.email },
      data: {
        username,
        phone,
        firstname,
        lastname,
        city,
        countryId,
        bio,
        currency: chosenCountry?.currency
      }
    });
    return NextResponse.json(updatedProfile);
    
  } catch (error) {
    console.log("[UPDATE_PROFILE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

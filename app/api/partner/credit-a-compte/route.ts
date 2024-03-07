// fait le 07/02/24

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";
/* HOW IT WORKS
# chaque partenaire a:
# un compteur PartnerCredit qui représente la garantie auprès de luke638
# si il est de 10.000f cfa par exemple
lorsqu'un membre crédite son compte de 2.000f cfa en passant par ce partenaire,
le partenaire crédite le compte du membre depuis sa page partner perso
son PartnerCredit est diminué de 2.OOOf cfa et le crédit du membre est augmenté de 2.000f cfa
cela veut dire qu'il reste 8.000f cfa au partner
il ne pourra accepter des somme d'argent des abonné pour créditer leur compte
qu'à hauteur de 8.000f cfa. l'abonné qui lui remet plus que 8.000f cfa
verra les sommes au dessus de 8.000f cfa ne pas être garantie en cas de problème.
luke638 ne pourra lui rembourser que les 8.000f cfa
cela veut aussi dire que le partner peut donner à un membre qui demande transfert de sa cagnotte
qu'à hauteur de 2.000f ....
*/
// 
// DECREASE PARTNER CREDIT AND INCREASE USER CREDIT 
export async function PATCH( req: Request ) {
  try{
      const body = await req.json(); 
  
      const { usercodepin, amountToCredit, } = body;
  
      const session = await auth();
  
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      if (!usercodepin) {
        return new NextResponse("User lukecode is required", { status: 400 });
      }  
      const connectedUser = await currentUserInfos()
      // on vérifie que celui qui modifie est un PARTNER 
      // s'il est partner
      if(connectedUser?.isPartner || connectedUser?.role === "ADMIN")
      {
        // le membre dont le compte doit être crédité
        const concernedUser = await prismadb.profile.findFirst({  // en prod
          where: { 
            usercodepin: usercodepin
          }
        })
        if(connectedUser?.partnerCredit >= amountToCredit)
        {
          // on decrease le creditPartner
          await prismadb.profile.updateMany({
            where: { usercodepin: connectedUser?.usercodepin},
            data: { 
              partnerCredit: connectedUser?.partnerCredit - amountToCredit,
              // 
              partnerCreditToRemit:connectedUser.partnerCreditToRemit + amountToCredit 
            }
          })
          // on increase le credit du membre
           const creditIncreased = await prismadb.profile.updateMany({   // en prod
            where: { usercodepin: usercodepin },
            data: { credit: concernedUser?.credit + amountToCredit }
          })
          return NextResponse.json(creditIncreased);
        }
        else{
           return new NextResponse("votre crédit de partenaire n'est pas suffisant", { status: 400 });
        }
      }
      else{
        return new NextResponse("Vous n'êtes pas un de nos partenaires", { status: 400 });
      }
    } catch (error) {
      console.log('[PARTNER_INCREASE_USER_CREDIT_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
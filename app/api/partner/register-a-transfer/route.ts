// ÇA MARCHE  AU 5/03/24

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

/* Ici le partner enregistre la demande de transfer de l'user
dont il a reçu au préalable le code de transfert, et lui donne l'argent
soit en espèce, soit par paypal, soit par paylib, soit par MoMo au Congo par exemple.
- le jackpot de l'user avait déjà été diminué de la somme demandée lors de cette demande
- la commission aussi avait déjà été prelevé du jackpot de l'user
- le partnerCreditToRemit du partenaire est diminué de amountToTransfer
*/ 
// DECREASE JACKPOT AND PICK COMMISSION
export async function PATCH( req: Request ) {
  try
  {
    const body = await req.json(); 
  
    const { usercodepin, transferCode } = body;
  
    const session = await auth();
  
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!usercodepin) {
      return new NextResponse("user code pin is required", { status: 400 });
    }  
    if (!transferCode) {
      return new NextResponse("Transfer code is required", { status: 400 });
    }  
    // ### PARTNER PROFILE DATA ### 
    const connectedUser = await currentUserInfos()  // en prod    
    // ### CONNECTED IS PARTNER ? #####
    if(connectedUser?.isPartner === true)
    {
      // RECEIVER DEMAND EXIST ?
      const demand = await prismadb.transferDemand.findFirst({
        where: { 
          transferCode: transferCode,
          usercodepin: usercodepin,
          isUsed:false
        }
      })
      // IF DEMAND EXIST AND IS NOT USED
      if(demand)
      {
        // ### PARTNER CREDIT IS >= AMOUNT TO TRANSFER ? 
        // if(connectedUser.partnerCreditToRemit >= demand?.amountToTransfer) // en dev
        if(connectedUser.partnerCredit >= demand?.amountToTransfer) // en dev
        {
          console.log("partner a le credit suffisant")
          // on met isUsed à true dans demand 
          const demandUsed = await prismadb.transferDemand.updateMany({  // en prod
            where: { 
              transferCode: transferCode,
              usercodepin: usercodepin
            },
            data: {
              isUsed: true
            }
          })
          // ENREGISTRER L'ACTIVITE 
          const activity = await prismadb.activity.create({
            data: {
              usercodepin: connectedUser?.usercodepin,   // en prod
              activity:  "Enregistrement d'une remise de cagnotte demamdée.", // String
              concerned: "La demande de retrait de : " + usercodepin, // Json?
              action: "Le code de retrait: " + transferCode + ", somme demandée " + demand.amountToTransfer + demand?.currency + "."  // Json?
            }
          })
          // ## on update ce que le partner peut recevoir (approvionnement de membre) ou transférer (remise de cagnotte)
          // on diminu le partnerCreditToRemit - amountToTransfer et on augmente partnerCredit + amountToTransfer
          await prismadb.profile.updateMany({  // en prod
            where: { usercodepin: connectedUser.usercodepin },
              data: {
                partnerCredit: connectedUser.partnerCredit + demand.amountToTransfer,
                //
                partnerCreditToRemit: connectedUser.partnerCreditToRemit - demand.amountToTransfer  // en prod
              }
          })
          return NextResponse.json(demandUsed);
        }
      }
    }
  } catch (error) {
    console.log('[DEMAND_USED_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
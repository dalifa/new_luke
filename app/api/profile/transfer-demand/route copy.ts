// ÇA MARCHE

import { auth } from "@/auth";
import { currentUser, currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// DEMANDER UN RETRAIT
export async function POST( req: Request ) {
  try{
      const body = await req.json();
  
      const { amountToRecover } = body;
  
      const session = await auth();
  
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      if (!amountToRecover) {
        return new NextResponse("amount is required", { status: 400 });
      }
      // on select les data du connecté
      const connectedUser = await currentUserInfos() 
      // on vérifie s'il a une cagnotte et si elle est > au montant demandé
      if(connectedUser?.jackpot && connectedUser?.jackpot > amountToRecover)
      { 
        const myRecoveries = await prismadb.transferDemand.count({
          where: { 
            usercodepin: connectedUser.usercodepin,  // en prod
            isUsed: false
          }
        })
        // s'il n'a pas 2 demandes de transfert en attente
        if(myRecoveries < 2)
        {
          // on genere le transfer code
          const transferCodeCount = await prismadb.transferDemand.count()
          // il y a zéro transfer code dans la table
          if(transferCodeCount === 0)
          {
            // Activity Registration
            await prismadb.activity.create({
              data: {
                usercodepin: connectedUser?.usercodepin, // Int
                activity:  "demande de transfert de sa cagnotte.", // String
                concerned: "le concerné: " + session.user.email, // Json?
                action: "montant demandé: " + amountToRecover + connectedUser.currency + ". sur une cagnotte de: " + connectedUser.jackpot + connectedUser.currency  // Json?
              }
            })
            // ##### ON MET UNE SOMME EQUIVALENTE A AMOUNT TO RECOVER EN QUARANTAINE #####
            await prismadb.profile.updateMany({
              where: { usercodepin: connectedUser.usercodepin },
              data: {
                jackpot: connectedUser.jackpot - amountToRecover
              }
            })
            //  ################  
            const newTransferCode = await prismadb.transferDemand.create({
                data: {
                  email: connectedUser?.googleEmail,
                  usercodepin: connectedUser?.usercodepin, // en prod
                  amountToTransfer: amountToRecover,
                  currency: connectedUser.currency,
                  // de 10 en 10 à partir de 1010
                  transferCode: 1010
                }
            }) 
            return NextResponse.json(newTransferCode);
          }
          else{
            // on select le dernier transfer code
            const lastTransferCode = await prismadb.transferDemand.findFirst({
              //take:1
              orderBy:{
                id: "desc"
              }
            })
            if(lastTransferCode?.transferCode && lastTransferCode?.transferCode > 0)
            {
              // Activity Registration
              await prismadb.activity.create({
                data: {
                  usercodepin: connectedUser?.usercodepin,   // en prod
                  activity:  "demande de transfert de sa cagnotte.", // String
                  concerned: "le concerné: " + session.user.email, // Json?
                  action: "montant demandé: " + amountToRecover + connectedUser.currency + ". sur une cagnotte de: " + connectedUser.jackpot + "."  // Json?
                }
              })
              // ##### ON MET UNE SOMME EQUIVALENTE A AMOUNT TO RECOVER EN QUARANTAINE #####
              await prismadb.profile.updateMany({
                where: { usercodepin: connectedUser.usercodepin },
                data: {
                  jackpot: connectedUser.jackpot - amountToRecover
                }
              })
            //  ################  
              // on genere un nouveau code
              const newTransferCode = await prismadb.transferDemand.create({
                data: {
                  email: session?.user.email,
                  usercodepin: connectedUser?.usercodepin, // en prod
                  amountToTransfer: amountToRecover,
                  currency: connectedUser.currency,
                  // de 10 en 10
                  transferCode: lastTransferCode?.transferCode + 10
                }
              })  
              return NextResponse.json(newTransferCode);
            }
          }
        } 
      }else{
        return new NextResponse("cagnotte inférieur à la demande", { status: 400 });
      }  
  
    } catch (error) {
      console.log('[CREATE_TRANSFER_CODE_POST]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
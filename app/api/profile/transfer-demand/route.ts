// ÇA MARCHE

import { auth } from "@/auth";
import { currentUser, currentUserInfos, connectedAmountThree } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// DEMANDER UN RETRAIT
export async function POST( req: Request ) {
  try
  {
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
    /* ON NE PEUT PAS DEMANDER UN RETRAIT SI SON JACKPOT EST INFERIEUR AU 3è MONTANT SELON SA MONNAIE */ 
    // on select le 3è montant selon la monnaie du connected
    const thirdAmount = await connectedAmountThree();
    // on vérifie s'il a une cagnotte et si elle est > au montant demandé
    if(connectedUser && thirdAmount && connectedUser?.jackpot > amountToRecover && amountToRecover > thirdAmount?.amount )
    { 
      // on select le taux en cours
      const currentRate = await prismadb.commissionRate.findFirst()
      const myRecoveries = await prismadb.transferDemand.count({
        where: { 
          usercodepin: connectedUser.usercodepin,  // en prod
          isUsed: false
        }
      })
      // s'il n'a pas 2 demandes de transfert en attente
      if(myRecoveries < 2 && currentRate)
      {
        // on genere le transfer code
        const transferCodeCount = await prismadb.transferDemand.count()
        // il y a zéro transfer code dans la table
        if(transferCodeCount === 0)
        {
          // on entre la demande
          const newTransferCode = await prismadb.transferDemand.create({
            data: {
              email: connectedUser?.googleEmail,
              usercodepin: connectedUser?.usercodepin, // en prod
              amountToTransfer: amountToRecover,
              currency: connectedUser?.currency,
              // de 10 en 10 à partir de 1010
              transferCode: 1010
            }
          }) 
          // #############################################################################################      

            // on calcul la commission sur le montant entrée
            // si la monnaie est l'euro, le 3e montant est 5€ le montant a retirer 
            // peut commencer à 6€ ce qui donne =  (6 x 5)/100  => 6 x 5%
            const ourCommission = (amountToRecover * currentRate?.rate)/100
            // sachant que la commission peut être un chiffre à virgule, 
            // on a 6x 5% = 0,30 
            // on multiplie par cent pour compter en centime, ce qui donne 0,30 x 100 = 30 centimes
            const ourCommissionInCents = (ourCommission * 100)
            // la somme à transférer en centimes dans notre exemple on aura: 6 x 100 = 600 centimes
            const amountToTransferInCents = (amountToRecover * 100)
            // la somme total a soustraire du jackpot du membre est 30cts + 600cts = 630cts
            const amountToSubtractInCents = ourCommissionInCents + amountToTransferInCents
            // on converti le jackpot en centimes
            // le jackpot du membre devant être superieur à la somme à transférer et au 3e montant
            // on a pour exemple jackpot = 10€ en centimes on a: 10 x 100 = 1000cts
            const jackpotInCents = connectedUser?.jackpot * 100
            // ###
            // ### SI LE JACKPOTCENTS DU MEMBRE EST >= A ourCommission
            if(connectedUser?.jackpotCents >= ourCommissionInCents)
            {
              // on transfert la somme demandé dans le credit du connecté
              const amountTransferred = await prismadb.profile.updateMany({
                where: { 
                  googleEmail: session?.user?.email,   // en prod
                  usercodepin: connectedUser?.usercodepin
                },
                  data: { 
                    // nouveau jackpot
                    jackpot: connectedUser?.jackpot - amountToRecover,
                    // nouveau jackpotCents
                    jackpotCents: connectedUser?.jackpotCents - ourCommissionInCents
                }
              })
              // Activity Registration
              await prismadb.activity.create({
                data: {
                  usercodepin: connectedUser?.usercodepin,   // en prod
                  activity:  "Demande de retrait cagnotte", // String
                  concerned: "Le concerné: " + session.user.email, // Json?
                  action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: 0," + ourCommissionInCents + connectedUser?.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                }
              })
              // on entre la commission de luke638
              // pour l'afficher côté client il faut diviser par 100 soit: ourCommission/100
              const commissionInCents = await prismadb.commission.create({
                data: {
                  userEmail: session?.user?.email,
                  usercodepin: connectedUser?.usercodepin,
                  amountToTransfer: amountToRecover,
                  // commission en centimes
                  commission: 0,
                  commissionCents: ourCommissionInCents,
                  currency: connectedUser?.currency,
                  origin: "jackpot to hands of member"
                }
              })
              return NextResponse.json(amountTransferred);
            }
            // ### SI LE JACKPOTCENTS DU MEMBRE EST < ourCommission
            if(connectedUser?.jackpotCents < ourCommissionInCents)
            {
              // les centimes du membres étant insuffisant pour payer notre commission
              // en prélève la commission dans la partie unité

              //## Calculer 5% de la somme
              //## const resultat = somme * taux;
              // soit ourCommission = amountToTransfer * 5%
              //## Séparer les unités et les centimes
              //## const unité = Math.floor(resultat);
              //## const centimes = Math.round((resultat - unité) * 100);

              const newJackpotInCents = jackpotInCents - amountToSubtractInCents
              // on remet jackopt en unité et cents: exemple 1130 / 100 = 11,30
              const newJackpot = newJackpotInCents / 100
              // on prélève les unités => exemple 11€
              const jackpotUnite = Math.floor(newJackpot)
              // en prélève la partie décimal, celle après la virgule => exemple 0,30cts
              const jackpotCentimes = Math.round((newJackpot - jackpotUnite) * 100)
              // s'il avait déjà des centimes, on les additionnes à celle qui viennent d'être générés
              const newJackpotCents = jackpotCentimes + connectedUser?.jackpotCents

              // SI SON NOUVEAU JACKPOTCENTS RESTE < à 1OO => dans l'exemple 100 = 1€ soit 1€ x 100 =  100cts
              if(newJackpotCents < 100)
              {
                // on transfert la somme demandé dans le credit du connecté
                const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: connectedUser?.usercodepin
                  },
                    data: { 
                      // nouveau jackpot
                      jackpot: jackpotUnite,
                      // nouveau jackpotCents
                      jackpotCents: newJackpotCents 
                    }
                })
                // Activity Registration
                // ### NOTRE COMMISSION POUVANT ÊTRE PAR EXEMPLE DE 1,35€ 
                //il nous faut prélever la partie unité et decimal distinctement
                //## const resultat = somme * taux;
                //## Séparer les unités et les centimes
                //## const unité = Math.floor(resultat);
                //## const centimes = Math.round((resultat - unité) * 100);
                const ourCommissionUnite = Math.floor(ourCommission)
                const ourCommissionCentimes = Math.round((ourCommission - ourCommissionUnite) * 100)
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedUser?.usercodepin,   // en prod
                    activity:  "Demande de retrait de cagnotte", // String
                    concerned: "Le concerné: " + session.user.email, // Json?
                    action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + connectedUser.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: connectedUser?.usercodepin,
                    amountToTransfer: amountToRecover,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: connectedUser?.currency,
                    origin: "jackpot to hands of member"
                  }
                })
                return NextResponse.json(amountTransferred);
              } 
              // SI SON NOUVEAU JACKPOTCENTS DEVIENT == à 1OO => dans l'exemple 100 = 1€ 
              if(newJackpotCents == 100){
                const newJackpot = 1 + jackpotUnite
                // on transfert la somme demandé dans le credit du connecté
                const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: connectedUser?.usercodepin
                  },
                  data: { 
                    // nouveau jackpot
                    jackpot: newJackpot,
                    // nouveau jackpotCents
                    jackpotCents: 0
                  }
                })
                // Activity Registration
                //## const resultat = somme * taux;
                //## Séparer les unités et les centimes
                //## const unité = Math.floor(resultat);
                //## const centimes = Math.round((resultat - unité) * 100);
                const ourCommissionUnite = Math.floor(ourCommission)
                const ourCommissionCentimes = Math.round((ourCommission - ourCommissionUnite) * 100)
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedUser?.usercodepin,   // en prod
                    activity:  "Demande de retrait de cagnotte", // String
                    concerned: "Le concerné: " + session.user.email, // Json?
                    action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + connectedUser?.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: connectedUser?.usercodepin,
                    amountToTransfer: amountToRecover,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: connectedUser?.currency,
                    origin: "jackpot to hands of member"
                  }
                })
                return NextResponse.json(amountTransferred);
              }
              // // SI SON NOUVEAU JACKPOTCENTS DEVIENT > à 1OO => PAR l'exemple 190 = 1,90€
              // on doit envoyer la partie unité c-a-d le 1 de 1,90€ vers jacpotUnite et garder la partie decimal comme cts
              if(newJackpotCents > 100)
              {
                const unite = Math.floor(newJackpotCents)
                // en prélève la partie décimal, celle après la virgule => exemple 0,30cts
                const jackpotCentimes = Math.round((newJackpotCents - unite) * 100)
                const newJackpot = 1 + jackpotUnite
                // on transfert la somme demandé dans le credit du connecté
                const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: connectedUser?.usercodepin
                  },
                  data: { 
                    // nouveau jackpot
                    jackpot: newJackpot,
                    // nouveau jackpotCents
                    jackpotCents: jackpotCentimes
                  }
                })
                // Activity Registration
                //## const resultat = somme * taux;
                //## Séparer les unités et les centimes
                //## const unité = Math.floor(resultat);
                //## const centimes = Math.round((resultat - unité) * 100);
                const ourCommissionUnite = Math.floor(ourCommission)
                const ourCommissionCentimes = Math.round((ourCommission - ourCommissionUnite) * 100)
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedUser?.usercodepin,   // en prod
                    activity:  "Demande de retrait de cagnotte", // String
                    concerned: "Le concerné: " + session.user.email, // Json?
                    action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + connectedUser?.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: connectedUser?.usercodepin,
                    amountToTransfer: amountToRecover,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: connectedUser?.currency,
                    origin: "jackpot to hands of member"
                  }
                })
                return NextResponse.json(amountTransferred);
              }  
            } 
          return NextResponse.json(newTransferCode);
          // ############################################################################################# 
        }
        else{
              // on select le dernier transfer code
              const lastTransferCode = await prismadb.transferDemand.findFirst({
              //take:1
              orderBy:{
                id: "desc"
              }
              })
              if(lastTransferCode && lastTransferCode?.transferCode > 0)
              {
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
                // ########################################################### 
                // on calcul la commission sur le montant entrée
                // si la monnaie est l'euro, le 3e montant est 5€ le montant a retirer 
                // peut commencer à 6€ ce qui donne =  (6 x 5)/100  => 6 x 5%
                const ourCommission = (amountToRecover * currentRate?.rate)/100
                // sachant que la commission peut être un chiffre à virgule, 
                // on a 6x 5% = 0,30 
                // on multiplie par cent pour compter en centime, ce qui donne 0,30 x 100 = 30 centimes
                const ourCommissionInCents = (ourCommission * 100)
                // la somme à transférer en centimes dans notre exemple on aura: 6 x 100 = 600 centimes
                const amountToTransferInCents = (amountToRecover * 100)
                // la somme total a soustraire du jackpot du membre est 30cts + 600cts = 630cts
                const amountToSubtractInCents = ourCommissionInCents + amountToTransferInCents
                // on converti le jackpot en centimes
                // le jackpot du membre devant être superieur à la somme à transférer et au 3e montant
                // on a pour exemple jackpot = 10€ en centimes on a: 10 x 100 = 1000cts
                const jackpotInCents = connectedUser?.jackpot * 100
                // ###
                // ### SI LE JACKPOTCENTS DU MEMBRE EST >= A ourCommission
                if(connectedUser?.jackpotCents >= ourCommissionInCents)
                {
                  // on transfert la somme demandé dans le credit du connecté
                  const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: connectedUser?.usercodepin
                  },
                  data: { 
                    // nouveau jackpot
                    jackpot: connectedUser?.jackpot - amountToRecover,
                    // nouveau jackpotCents
                    jackpotCents: connectedUser?.jackpotCents - ourCommissionInCents
                  }
                  })
                  // Activity Registration
                  await prismadb.activity.create({
                  data: {
                    usercodepin: connectedUser?.usercodepin,   // en prod
                    activity:  "Demande de retrait de cagnotte", // String
                    concerned: "Le concerné: " + session.user.email, // Json?
                    action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: 0," + ourCommissionInCents + connectedUser?.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                  }
                  })
                  // on entre la commission de luke638
                  // pour l'afficher côté client il faut diviser par 100 soit: ourCommission/100
                  const commissionInCents = await prismadb.commission.create({
                    data: {
                      userEmail: session?.user?.email,
                      usercodepin: connectedUser?.usercodepin,
                      amountToTransfer: amountToRecover,
                      // commission en centimes
                      commission: 0,
                      commissionCents: ourCommissionInCents,
                      currency: connectedUser?.currency,
                      origin: "jackpot to hands of member"
                    }
                  })
                  return NextResponse.json(amountTransferred);
                }
                // ### SI LE JACKPOTCENTS DU MEMBRE EST < ourCommission
                if(connectedUser?.jackpotCents < ourCommissionInCents)
                {
                  // les centimes du membres étant insuffisant pour payer notre commission
                  // en prélève la commission dans la partie unité

                  //## Calculer 5% de la somme
                  //## const resultat = somme * taux;
                  // soit ourCommission = amountToTransfer * 5%
                  //## Séparer les unités et les centimes
                  //## const unité = Math.floor(resultat);
                  //## const centimes = Math.round((resultat - unité) * 100);

                  const newJackpotInCents = jackpotInCents - amountToSubtractInCents
                  // on remet jackopt en unité et cents: exemple 1130 / 100 = 11,30
                  const newJackpot = newJackpotInCents / 100
                  // on prélève les unités => exemple 11€
                  const jackpotUnite = Math.floor(newJackpot)
                  // en prélève la partie décimal, celle après la virgule => exemple 0,30cts
                  const jackpotCentimes = Math.round((newJackpot - jackpotUnite) * 100)
                  // s'il avait déjà des centimes, on les additionnes à celle qui viennent d'être générés
                  const newJackpotCents = jackpotCentimes + connectedUser?.jackpotCents

                  // SI SON NOUVEAU JACKPOTCENTS RESTE < à 1OO => dans l'exemple 100 = 1€ soit 1€ x 100 =  100cts
                  if(newJackpotCents < 100)
              {
                // on transfert la somme demandé dans le credit du connecté
                const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: connectedUser?.usercodepin
                  },
                    data: { 
                      // nouveau jackpot
                      jackpot: jackpotUnite,
                      // nouveau jackpotCents
                      jackpotCents: newJackpotCents 
                    }
                })
                // Activity Registration
                // ### NOTRE COMMISSION POUVANT ÊTRE PAR EXEMPLE DE 1,35€ 
                //il nous faut prélever la partie unité et decimal distinctement
                //## const resultat = somme * taux;
                //## Séparer les unités et les centimes
                //## const unité = Math.floor(resultat);
                //## const centimes = Math.round((resultat - unité) * 100);
                const ourCommissionUnite = Math.floor(ourCommission)
                const ourCommissionCentimes = Math.round((ourCommission - ourCommissionUnite) * 100)
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedUser?.usercodepin,   // en prod
                    activity:  "Demande de retrait de cagnotte", // String
                    concerned: "Le concerné: " + session.user.email, // Json?
                    action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + connectedUser.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: connectedUser?.usercodepin,
                    amountToTransfer: amountToRecover,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: connectedUser?.currency,
                    origin: "jackpot to hands of member"
                  }
                })
                return NextResponse.json(amountTransferred);
                  } 
                  // SI SON NOUVEAU JACKPOTCENTS DEVIENT == à 1OO => dans l'exemple 100 = 1€ 
                  if(newJackpotCents == 100){
                const newJackpot = 1 + jackpotUnite
                // on transfert la somme demandé dans le credit du connecté
                const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: connectedUser?.usercodepin
                  },
                  data: { 
                    // nouveau jackpot
                    jackpot: newJackpot,
                    // nouveau jackpotCents
                    jackpotCents: 0
                  }
                })
                // Activity Registration
                //## const resultat = somme * taux;
                //## Séparer les unités et les centimes
                //## const unité = Math.floor(resultat);
                //## const centimes = Math.round((resultat - unité) * 100);
                const ourCommissionUnite = Math.floor(ourCommission)
                const ourCommissionCentimes = Math.round((ourCommission - ourCommissionUnite) * 100)
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedUser?.usercodepin,   // en prod
                    activity:  "Demande de retrait de cagnotte", // String
                    concerned: "Le concerné: " + session.user.email, // Json?
                    action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + connectedUser?.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: connectedUser?.usercodepin,
                    amountToTransfer: amountToRecover,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: connectedUser?.currency,
                    origin: "jackpot to hands of member"
                  }
                })
                return NextResponse.json(amountTransferred);
                  }
                  // // SI SON NOUVEAU JACKPOTCENTS DEVIENT > à 1OO => PAR l'exemple 190 = 1,90€
                  // on doit envoyer la partie unité c-a-d le 1 de 1,90€ vers jacpotUnite et garder la partie decimal comme cts
                  if(newJackpotCents > 100)
              {
                const unite = Math.floor(newJackpotCents)
                // en prélève la partie décimal, celle après la virgule => exemple 0,30cts
                const jackpotCentimes = Math.round((newJackpotCents - unite) * 100)
                const newJackpot = 1 + jackpotUnite
                // on transfert la somme demandé dans le credit du connecté
                const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: connectedUser?.usercodepin
                  },
                  data: { 
                    // nouveau jackpot
                    jackpot: newJackpot,
                    // nouveau jackpotCents
                    jackpotCents: jackpotCentimes
                  }
                })
                // Activity Registration 
                //## const resultat = somme * taux;
                //## Séparer les unités et les centimes
                //## const unité = Math.floor(resultat);
                //## const centimes = Math.round((resultat - unité) * 100);
                const ourCommissionUnite = Math.floor(ourCommission)
                const ourCommissionCentimes = Math.round((ourCommission - ourCommissionUnite) * 100)
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedUser?.usercodepin,   // en prod
                    activity:  "Demande de retrait de cagnotte", // String
                    concerned: "Le concerné: " + session.user.email, // Json?
                    action: "Somme demandée: " + amountToRecover + connectedUser?.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + connectedUser?.currency + " sur une cagnotte de: " + connectedUser.jackpot + connectedUser.jackpotCents + connectedUser.currency  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: connectedUser?.usercodepin,
                    amountToTransfer: amountToRecover,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: connectedUser?.currency,
                    origin: "jackpot to hands of member"
                  }
                })
                return NextResponse.json(amountTransferred);
                  }  
                }
                // ############################################################### 
                
                return NextResponse.json(newTransferCode);
              }
            }
      }// fin 2 recoveries
    } 
  
  } catch (error) {
    console.log('[CREATE_TRANSFER_CODE_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
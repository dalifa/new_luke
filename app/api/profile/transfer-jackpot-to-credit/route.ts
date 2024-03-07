// ÇA MARCHE

import { auth } from "@/auth";
import { currentUserInfos, theThirdAmount } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// DECREASE JACKPOT AND INCREASE CREDIT AND PICK COMMISSION 
export async function PATCH( req: Request ) {
  try{
      const body = await req.json(); 
  
      const { amountToTransfer } = body;
  
      const session = await auth();
  
      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      if (!amountToTransfer) {
        return new NextResponse("Amount is required", { status: 400 });
      }  
      if(amountToTransfer > 0)
      {
        // on select les data du profile
        const currentUser = await currentUserInfos()
        /* ON NE PEUT FAIRE LE TRANSFERT QUE SI SON JACKPOT DÉPASSE LE 3è 
        MONTANT SELON SA MONNAIE */ 
        // on select le 3è montant selon la monnaie du connected
        const thirdAmount = await theThirdAmount();
        //
        if(currentUser?.jackpot && thirdAmount?.amount && currentUser?.jackpot > thirdAmount?.amount )
        {
          // on select le taux en cours
          const currentRate = await prismadb.commissionRate.findFirst()
          //
          if(currentRate && amountToTransfer > thirdAmount.amount && currentUser.jackpot > amountToTransfer)
          {
            // on calcul la commission sur le montant entrée
            // si la monnaie est l'euro, le 3e montant est 5€ le montant a transférer 
            // peut commencer à 6€ ce qui donne =  (6 x 5)/100  => 6 x 5%
            const ourCommission = (amountToTransfer * currentRate?.rate)/100
            // sachant que la commission peut être un chiffre à virgule, 
            // on a 6x 5% = 0,30 
            // on multiplie par cent pour compter en centime, ce qui donne 0,30 x 100 = 30 centimes
            const ourCommissionInCents = (ourCommission * 100)
            // la somme à transférer en centimes dans notre exemple on aura: 6 x 100 = 600 centimes
            const amountToTransferInCents = (amountToTransfer * 100)
            // la somme total a soustraire du jackpot du membre est 30cts + 600cts = 630cts
            const amountToSubtractInCents = ourCommissionInCents + amountToTransferInCents
            // on converti le jackpot en centimes
            // le jackpot du membre devant être superieur à la somme à transférer et au 3e montant
            // on a pour exemple jackpot = 10€ en centimes on a: 10 x 100 = 1000cts
            const jackpotInCents = currentUser.jackpot * 100
            // ###
            // ### SI LE JACKPOTCENTS DU MEMBRE EST >= A ourCommission
            if(currentUser?.jackpotCents >= ourCommissionInCents)
            {
              // on transfert la somme demandé dans le credit du connecté
              const amountTransferred = await prismadb.profile.updateMany({
                where: { 
                  googleEmail: session?.user?.email,   // en prod
                  usercodepin: currentUser?.usercodepin
                },
                  data: { 
                    credit: currentUser?.credit + amountToTransfer,
                    // nouveau jackpot
                    jackpot: currentUser?.jackpot - amountToTransfer,
                    // nouveau jackpotCents
                    jackpotCents: currentUser.jackpotCents - ourCommissionInCents
                }
              })
              // Activity Registration
                await prismadb.activity.create({
                data: {
                  usercodepin: currentUser?.usercodepin,   // en prod
                  activity:  "transfert de la cagnotte vers le credit", // String
                  concerned: "le concerné: " + session.user.email, // Json?
                  action: "somme transférée: " + amountToTransfer + currentUser.currency + ". commission: 0," + ourCommissionInCents + currentUser.currency + "."  // Json?
                }
              })
              // on entre la commission de luke638
              // pour l'afficher côté client il faut diviser par 100 soit: ourCommission/100
              const commissionInCents = await prismadb.commission.create({
                data: {
                  userEmail: session?.user?.email,
                  usercodepin: currentUser?.usercodepin,
                  amountToTransfer: amountToTransfer,
                  // commission en centimes
                  commission: 0,
                  commissionCents: ourCommissionInCents,
                  currency: currentUser?.currency,
                  origin: "jackpot to credit"
                }
              })
              return NextResponse.json(amountTransferred);
            }
            // ### SI LE JACKPOTCENTS DU MEMBRE EST < ourCommission
            if(currentUser?.jackpotCents < ourCommissionInCents){
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
              const newJackpotCents = jackpotCentimes + currentUser.jackpotCents

              // SI SON NOUVEAU JACKPOTCENTS RESTE < à 1OO => dans l'exemple 100 = 1€ soit 1€ x 100 =  100cts
              if(newJackpotCents < 100)
              {
                // on transfert la somme demandé dans le credit du connecté
                const amountTransferred = await prismadb.profile.updateMany({
                  where: { 
                    googleEmail: session?.user?.email,   // en prod
                    usercodepin: currentUser?.usercodepin
                  },
                    data: { 
                      credit: currentUser?.credit + amountToTransfer,
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
                    usercodepin: currentUser?.usercodepin,   // en prod
                    activity:  "transfert de la cagnotte vers le credit", // String
                    concerned: "le concerné: " + session.user.email, // Json?
                    action: "somme transférée: " + amountToTransfer + currentUser.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + currentUser.currency + "."  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: currentUser?.usercodepin,
                    amountToTransfer: amountToTransfer,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: currentUser?.currency,
                    origin: "jackpot to credit"
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
                    usercodepin: currentUser?.usercodepin
                  },
                  data: { 
                    credit: currentUser?.credit + amountToTransfer,
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
                    usercodepin: currentUser?.usercodepin,   // en prod
                    activity:  "transfert de la cagnotte vers le credit", // String
                    concerned: "le concerné: " + session.user.email, // Json?
                    action: "somme transférée: " + amountToTransfer + currentUser.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + currentUser.currency + "."  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: currentUser?.usercodepin,
                    amountToTransfer: amountToTransfer,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: currentUser?.currency,
                    origin: "jackpot to credit"
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
                    usercodepin: currentUser?.usercodepin
                  },
                  data: { 
                    credit: currentUser?.credit + amountToTransfer,
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
                    usercodepin: currentUser?.usercodepin,   // en prod
                    activity:  "transfert de la cagnotte vers le credit", // String
                    concerned: "le concerné: " + session.user.email, // Json?
                    action: "somme transférée: " + amountToTransfer + currentUser.currency + ". commission: " + ourCommissionUnite + "," + ourCommissionCentimes + currentUser.currency + "."  // Json?
                  }
                })
                // on entre la commission de luke638
                const commissionInCents = await prismadb.commission.create({
                  data: {
                    userEmail: session?.user?.email,
                    usercodepin: currentUser?.usercodepin,
                    amountToTransfer: amountToTransfer,
                    // commission en centimes
                    commission: ourCommissionUnite,
                    commissionCents: ourCommissionCentimes,
                    currency: currentUser?.currency,
                    origin: "jackpot to credit"
                  }
                })
                return NextResponse.json(amountTransferred);
              }
            }
          }
        }
      }
      
    }catch (error) {
      console.log('[DECREASE_JACKPOT_INCREASE_CREDIT_PATCH]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
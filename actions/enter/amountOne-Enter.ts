"use server";

import { amountOne, currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// AMOUNT ONE TOTALITY COLLECTION ENTER    
export const amountOneEnterAction = async () => {
  try {
    const metrics = await prismadb.metric.findFirst() // en prod
    // Les profile data du connecté
    const connected = await currentUserInfos() // en prod
    // Le montant One par default c'est 1€ ( pour le lancement )
    const Amount = await amountOne()
    // 1- Vérifier s'il a du crédit et si son crédit est >= 1€
    if( connected?.credit && Amount?.amount && connected.credit >= Amount?.amount )
    {
      // 2- Déjà dans une collecte de même amount ?
      const alreadyInCollectionCount = await prismadb.collection.count({
        where: {
          amount: Amount?.amount,
          currency: Amount?.currency,
          collectionType: "totality",
          email: connected.googleEmail,  // prod
          usercodepin: connected?.usercodepin,
          isGroupComplete: false
        }
      })
      // S'IL N'EST PAS DÉJÀ DANS UNE COLLECTE DE MÊME AMOUNT
      if( alreadyInCollectionCount < 1 ) 
      {
        // on vérifie, on compte s'il y a une collecte de même amount d'ouverte
        const isOpenCollectionExist = await prismadb.collectionList.count({
          where: {
            amount: Amount?.amount,
            currency: Amount?.currency,
            collectionType: "totality",
            isGroupComplete: false
          }
        })
        // s'il y a pas de collecte d'ouverte du montant choisi
        if(isOpenCollectionExist < 1)
        {
          //- on select le nextOwnIdCollectionToEnter dans metric
            //- on crée une collecte
            await prismadb.collectionList.create({
              data: {
                ownId: metrics?.nextOwnIdCollectionToEnter,
                amount: Amount?.amount,
                currency: Amount?.currency,
                collectionType: "totality",
              }
            })
            //- on l'y entre
            await prismadb.collection.create({
              data: {
                ownId: metrics?.nextOwnIdCollectionToEnter,
                amount: Amount?.amount,
                currency: Amount?.currency,
                collectionType: "totality",
                // current nbr of participants
                group: metrics?.currentgroup,
                // il est le premier participant
                groupStatus: 1,
                // le connecté qu'on entre
                email: connected?.googleEmail,
                usercodepin: connected?.usercodepin
              }
            })
            // On Update le nextOwnIdCollectionToEnter
            if(metrics?.nextOwnIdCollectionToEnter)
            {
              await prismadb.metric.updateMany({
                data: {
                  nextOwnIdCollectionToEnter : metrics?.nextOwnIdCollectionToEnter + 1
                }
              })
            }
        }
        else{  
          // S'IL Y A 1 COLLECTE D'OUVERTE
          if(isOpenCollectionExist === 1)
          {
            // on select son ownId
            const currentOwnId = await prismadb.collectionList.findFirst({
              where: {
                amount: Amount?.amount,
                currency: Amount?.currency,
                collectionType: "totality",
                isGroupComplete: false
              }
            })
            //- On verifie que le connecté n'y a pas déjà un recipient
              // Récupérer tous les membres et les joueurs
              const myrecipients = await prismadb.alreadyMeet.findMany({
                where: {
                  connectedEmail: connected?.googleEmail,
                  connectedCodepin: connected?.usercodepin
                }
              });
              const Participants = await prismadb.collection.findMany({
                where: {
                  ownId: currentOwnId?.ownId
                }
              });
              // Créer des ensembles d'emails pour une comparaison rapide
              const myrecipientsEmails = new Set(recipientsEmails.map(recipientsEmail:any => alreadyMeet.metEmail));
              const participantsEmails = new Set(participantsEmail.map(player => player.email));
              // Trouver les joueurs qui sont également membres
              const commonUsers = [...playerEmails].filter(email => memberEmails.has(email));

              //- s'il n'y a aucun recipient , on l'y entre
                //- et on vérifie ensuite si le nombre de membre est complet
                  //- si c'est le cas on cloture la collecte
                  //- on update le nextOwnIdCollectionToEnter
              //- s'il y a un de ses recipient, on ne l'y entre pas
              //- on crée un nouvelle collecte et on l'y entre
          }
          // ##### ##### ##### ##### ##### #####
          // S'IL Y A DEUX COLLECTES D'OUVERTES
          if(isOpenCollectionExist === 2 )
          {}
          // S'IL Y A PLUS DE DEUX COLLECTES D'OUVERTES
          if(isOpenCollectionExist > 2)
          {}
        }
      }
      else{
        console.log("déjà dans une collecte  isgroupComplete = false")
      }
    } // fin credit exist et >= a amount one ? 
    revalidatePath('/dashboard');
    redirect('/dashboard')
  } catch (error) {
    // gerer l'erreu  
  }
}


/* de gpt
    // Récupérer tous les membres et les joueurs
    const members = await prisma.member.findMany();
    const players = await prisma.player.findMany();

    // Créer des ensembles d'emails pour une comparaison rapide
    const memberEmails = new Set(members.map(member => member.email));
    const playerEmails = new Set(players.map(player => player.email));

    // Trouver les joueurs qui sont également membres
    const commonUsers = [...playerEmails].filter(email => memberEmails.has(email));

    res.status(200).json({
      commonUsers,
      allPlayersInMembers: commonUsers.length === playerEmails.size
    });
*/
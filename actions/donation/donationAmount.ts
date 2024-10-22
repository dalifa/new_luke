"use server";

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

 
// à la place de params je peux mettre id (qui représente id du fichier donationId) 
  export async function donationAmountAction(params: string) {
  // l'id du recipient choisi (son id dans la collecte: table collection ) 
  // console.log("le recipient est: ", params) // ça marche   
  const connectedProfile = await currentUserInfos()
  // recipientId in collection table == params 
  // recipient collection datas 
  const recipientData = await prismadb.collection.findFirst({
    where: { id: params }
  })
  // recipient profile
  const recipientProfile = await prismadb.profile.findFirst({
    where: { 
      usercodepin: recipientData?.usercodepin,
    }
  })

  // on vérifie si la collecte concerné est pas cloturée et son group est bien complet
  if(recipientData?.isGroupComplete === true && recipientData.isCollectionClosed === false)
  {
    // on vérifie que le connecté est bien dans la même collecte que le recipient
    const inTheSameCollection = await prismadb.collection.count({
      where: {
        usercodepin: connectedProfile?.usercodepin,  // en prod
        ownId: recipientData.ownId, // obligatoire
        amount: recipientData.amount, // obligatoire
        currency: recipientData.currency, // obligatoire
        collectionType: recipientData.collectionType // obligatoire
      }
    })
    // il est dans la même collecte que son recipient
    if(inTheSameCollection === 1)
    {
      // on vérifie que le connecté n'ai pas encore donné 
      const connectedCollectionData = await prismadb.collection.findFirst({
        where: {
          usercodepin: connectedProfile?.usercodepin,  // en prod
          ownId: recipientData.ownId,
          amount: recipientData.amount, // obligatoire
          currency: recipientData.currency, // obligatoire
          collectionType: recipientData.collectionType // obligatoire
        }
      })
      // le connecter n'a pas encore donné
      if(connectedCollectionData?.hasGive === false)
      { 
        // Activity Registration
        await prismadb.activity.create({
          data: {
            usercodepin: connectedProfile?.usercodepin,   // en prod
            activity:  "don dans une collecte", // String
            concerned: "le destinataire du don est: " + recipientData?.usercodepin + ".", // Json?
            action: "don de : " + recipientData?.amount + recipientData?.currency + " dans une collecte " + recipientData.collectionType + " de ownId: " + recipientData.ownId  // Json?
          }
        })
        // ## on verifie si le recipient avait dejà reçu un 1er don
        const recipientDonationExist = await prismadb.collectionResult.count({
          where: {
            collectionOwnId : recipientData?.ownId,
            amount : recipientData?.amount,
            currency : recipientData?.currency,
            collectionType: recipientData?.collectionType,
            recipientcodepin: recipientData?.usercodepin,
            recipientEmail : recipientData?.googleEmail
          }
        })
        // si le recipient ne figure pas dans la table
        if(recipientDonationExist < 1 )
        {
          // on enregistre le don du connecté à recipient dans la table CollectionResult
          await prismadb.collectionResult.create({
            data: {
              donatorcodepin : connectedCollectionData?.usercodepin,
              donatorEmail : connectedCollectionData?.googleEmail,
              collectionOwnId : recipientData?.ownId,
              amount : recipientData?.amount,
              currency : recipientData?.currency,
              collectionType: recipientData?.collectionType,
              recipientcodepin: recipientData?.usercodepin,
              recipientEmail : recipientData?.googleEmail,
              donationReceived: 1
            }
          }) 
        }
        else{
          //
          await prismadb.collectionResult.create({
            data: {
              donatorcodepin : connectedCollectionData?.usercodepin,
              donatorEmail : connectedCollectionData?.googleEmail,
              collectionOwnId : recipientData?.ownId,
              amount : recipientData?.amount,
              currency : recipientData?.currency,
              collectionType: recipientData?.collectionType,
              recipientcodepin: recipientData?.usercodepin,
              recipientEmail : recipientData?.googleEmail,
              donationReceived: 1
            }
          })
          // update de donationReceived à 2
          await prismadb.collectionResult.updateMany({
            where: {
              collectionOwnId : recipientData?.ownId,
              amount : recipientData?.amount,
              currency : recipientData?.currency,
              collectionType: recipientData?.collectionType,
              recipientcodepin: recipientData?.usercodepin,
              recipientEmail : recipientData?.googleEmail,
              donationReceived: 1
            },
            data: { donationReceived: 2 }
          })
        }
        // on update collection on met hasgive du connected à true 
        await prismadb.collection.updateMany({
          where: {
            usercodepin: connectedCollectionData.usercodepin,
            ownId: recipientData.ownId, // obligatoire
            amount : recipientData?.amount, // obligatoire
            currency : recipientData?.currency, // obligatoire
            collectionType: recipientData?.collectionType, // obligatoire
            // il faut mettre ces 5 fields pour bien différencier la collecte 
            // d'autres collectes de somme ou type différents
          },
          data: {
            hasGive: true
          }
        })
        /* ####### a voir si on le met
        if(recipientProfile)
        {
        // ON ENTRE SON RECIPIENT DANS LA TABLE RECIPIENT
          await prismadb.recipient.create({
            data: {
              profileEmail: connectedProfile?.id,
              profileUsercodepin: connectedProfile?.usercodepin,
              recipientEmail: recipientProfile?.id,
              recipientUsercodepin: recipientProfile?.usercodepin
            }
          })
        }  */
        // on compte ceux qui ont donné
        const allHasGive = await prismadb.collection.count({
          where: {
            ownId: recipientData?.ownId, // obligatoire
            amount : recipientData?.amount, // obligatoire
            currency : recipientData?.currency, // obligatoire
            collectionType: recipientData?.collectionType, // obligatoire
            //
            hasGive: true
          }
        })
        // on vérifie si ceux qui ont donné sont == à ceux qui y participe
        if(recipientData?.group === allHasGive)
        {
          // on close la collecte dans collection
          await prismadb.collection.updateMany({
            where: {
              ownId: recipientData?.ownId, // obligatoire
              amount : recipientData?.amount, // obligatoire
              currency : recipientData?.currency, // obligatoire
              collectionType: recipientData?.collectionType, // obligatoire
              // supllément
              hasGive: true
            },
            data: {
              isCollectionClosed: true
            }
          })
          // on close la collecte dans collectionList
          await prismadb.collectionList.updateMany({
            where: {
              ownId: recipientData.ownId, // obligatoire
              amount : recipientData?.amount, // obligatoire
              currency : recipientData?.currency, // obligatoire
              collectionType: recipientData?.collectionType, // obligatoire
              // supplément
              isGroupComplete: true
            },
            data: {
              isCollectionClosed: true
            }
          })
          // ON SELECT CELUI QUI A DONATION RECEIVED == 2
          const winner = await prismadb.collectionResult.findFirst({
            where: {
              collectionOwnId : recipientData?.ownId,
              amount : recipientData?.amount,
              currency : recipientData?.currency,
              collectionType: recipientData?.collectionType,
              recipientcodepin: recipientData?.usercodepin,
              recipientEmail : recipientData?.googleEmail,
              donationReceived: 2
            }
          })
          // ON LUI DONNE LE TRIPL
          // ON SELECT SON CREDIT ET SON JACKPOT
          const winnerProfile = await prismadb.profile.findFirst({
            where: {
              googleEmail: winner?.recipientEmail,
              usercodepin: winner?.recipientcodepin
            }
          })
          if(winnerProfile)
          {
            // on update son credit du montant initial
            await prismadb.profile.updateMany({
              where: { 
                googleEmail: winnerProfile?.googleEmail,
                usercodepin: winnerProfile?.usercodepin
              },
              data: { credit: winnerProfile?.credit + recipientData?.amount }
            })
            // on update son jackpot du montant initial x 2
            const jackpotReceived = recipientData?.amount + recipientData?.amount
            //
            await prismadb.profile.updateMany({
              where: { 
                googleEmail: winnerProfile?.googleEmail,
                usercodepin: winnerProfile?.usercodepin
              },
              data: { jackpot: winnerProfile?.jackpot + jackpotReceived }
            })
          }
        } 
        revalidatePath('/dashboard')
        redirect("/dashboard")
      } // donation registered 
    }
  }
  //
}

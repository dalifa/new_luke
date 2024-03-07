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
  const recipientCollectionData = await prismadb.collection.findFirst({
    where: { id: params }
  })
  // recipient profile
  const recipientProfile = await prismadb.profile.findFirst({
    where: { 
      usercodepin: recipientCollectionData?.usercodepin,
    }
  })

  // on vérifie si la collecte concerné est pas cloturée et son group est bien complet
  if(recipientCollectionData?.isGroupComplete === true && recipientCollectionData.isCollectionClosed === false)
  {
    // on vérifie que le connecté est bien dans la même collecte que le recipient
    const inTheSameCollection = await prismadb.collection.count({
      where: {
        usercodepin: connectedProfile?.usercodepin,  // en prod
        ownId: recipientCollectionData.ownId, // obligatoire
        amount: recipientCollectionData.amount, // obligatoire
        currency: recipientCollectionData.currency, // obligatoire
        collectionType: recipientCollectionData.collectionType // obligatoire
      }
    })
    //
    if(inTheSameCollection === 1)
    {
      // on vérifie que le connecté n'ai pas encore donné 
      const connectedCollectionData = await prismadb.collection.findFirst({
        where: {
          usercodepin: connectedProfile?.usercodepin,  // en prod
          ownId: recipientCollectionData.ownId,
          amount: recipientCollectionData.amount, // obligatoire
          currency: recipientCollectionData.currency, // obligatoire
          collectionType: recipientCollectionData.collectionType // obligatoire
        }
      })
      //
      if(connectedCollectionData?.hasGive === false)
      { 
        // Activity Registration
        await prismadb.activity.create({
          data: {
            usercodepin: connectedProfile?.usercodepin,   // en prod
            activity:  "don dans une collecte", // String
            concerned: "le destinataire du don est: " + recipientCollectionData?.usercodepin + ".", // Json?
            action: "don de : " + recipientCollectionData?.amount + recipientCollectionData?.currency + " dans une collecte " + recipientCollectionData.collectionType + " de ownId: " + recipientCollectionData.ownId  // Json?
          }
        })
        // ##
        // on enregistre le don du connecté à recipient dans la table CollectionResult
        await prismadb.collectionResult.create({
          data: {
            donatorcodepin : connectedCollectionData?.usercodepin,
            donatorEmail : connectedCollectionData?.email,
            collectionOwnId : recipientCollectionData?.ownId,
            amount : recipientCollectionData?.amount,
            currency : recipientCollectionData?.currency,
            collectionType: recipientCollectionData?.collectionType,
            recipientcodepin: recipientCollectionData?.usercodepin,
            recipientEmail : recipientCollectionData?.email
          }
        })
        // on update collection on met hasgive du connected à true 
        await prismadb.collection.updateMany({
          where: {
            usercodepin: connectedCollectionData.usercodepin,
            ownId: recipientCollectionData.ownId, // obligatoire
            amount : recipientCollectionData?.amount, // obligatoire
            currency : recipientCollectionData?.currency, // obligatoire
            collectionType: recipientCollectionData?.collectionType, // obligatoire
            // il faut mettre ces 5 fields pour bien différencier la collecte 
            // d'autres collectes de somme ou type différents
          },
          data: {
            hasGive: true
          }
        })
        // on update le jackpot du recipient + amount
        const myJackpot = await prismadb.profile.findFirst({
          where: { 
            googleEmail: recipientProfile?.googleEmail,
            usercodepin: recipientCollectionData.usercodepin
          }
        }) 
        if(myJackpot)
        {
          //
          await prismadb.profile.updateMany({
            where: { usercodepin: recipientCollectionData.usercodepin },
            data: { jackpot: myJackpot.jackpot + recipientCollectionData?.amount}
          })
        }
        // ########
        
        // on compte ceux qui ont donné
        const allHasGive = await prismadb.collection.count({
          where: {
            ownId: recipientCollectionData?.ownId, // obligatoire
            amount : recipientCollectionData?.amount, // obligatoire
            currency : recipientCollectionData?.currency, // obligatoire
            collectionType: recipientCollectionData?.collectionType, // obligatoire
            //
            hasGive: true
          }
        })
        // on vérifie si ceux qui ont donné sont == à ceux qui y participe
        if(recipientCollectionData.group === allHasGive)
        {
          // on close la collecte dans collection
          const closeCollection = await prismadb.collection.updateMany({
            where: {
              ownId: recipientCollectionData?.ownId, // obligatoire
              amount : recipientCollectionData?.amount, // obligatoire
              currency : recipientCollectionData?.currency, // obligatoire
              collectionType: recipientCollectionData?.collectionType, // obligatoire
              // supllément
              hasGive: true
            },
            data: {
              isCollectionClosed: true
            }
          })
          // on close la collecte dans collectionList
          const closeCollectionList = await prismadb.collectionList.updateMany({
            where: {
              ownId: recipientCollectionData.ownId, // obligatoire
              amount : recipientCollectionData?.amount, // obligatoire
              currency : recipientCollectionData?.currency, // obligatoire
              collectionType: recipientCollectionData?.collectionType, // obligatoire
              // supplément
              isGroupComplete: true
            },
            data: {
              isCollectionClosed: true
            }
          })
          //
        } 
        revalidatePath('/dashboard')
        redirect("/dashboard")
      } // donation registered 
    }
  }
  //
}

"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 
 
// à la place de params je peux mettre id (qui représente id du fichier donationId) 
  export async function donationAmountAction(params: string) {
  // params c'est l'id du recipient choisi (son id dans la table collecteParticipant)  
  const connectedProfile = await currentUserInfos()
  // recipient profile datas 
  const recipientProfile = await prismadb.collectionParticipant.findFirst({
    where: { id: params },
    include: { profile: true },
  })
  // collection data
  const collectionData = await prismadb.collectionParticipant.findFirst({
    where: { id: params },
    include: { collection: true }
  })
  //
  const amountConcerned = await prismadb.amount.findFirst({
    where: {
      currency: collectionData?.collection?.currency,
      amount: collectionData?.collection?.amount
    }
  })
  //
// ######################################
  // Activity Registration
  await prismadb.activity.create({
    data: {
      usercodepin: connectedProfile?.usercodepin,   // en prod
      activity:  "don dans une collecte", // String
      concerned: "le destinataire du don est: " + recipientProfile?.profile?.usercodepin + ".", // Json?
      action: "don de : " + collectionData?.collection?.amount + collectionData?.collection?.currency + " dans une collecte " + collectionData?.collection?.collectionType + "."  // Json?
    }
  })
  // On Update de Jackpot du recipient
  if(recipientProfile && amountConcerned)
  {
    const newJackpot = recipientProfile?.profile?.jackpot + amountConcerned?.amount
    //
    await prismadb.profile.updateMany({
      where: {googleEmail: recipientProfile?.profile?.googleEmail},
      data: {
        jackpot: newJackpot
      }
    })
  }
  // on verifie si le recipient avait dejà reçu un 1er don
  const recipientDonationExist = await prismadb.collectionResult.count({
    where: {
      collectionId: collectionData?.collection?.id,
      amount : amountConcerned?.amount,
      currency : amountConcerned?.currency,
      collectionType: collectionData?.collection?.collectionType,
      recipientEmail : recipientProfile?.profile?.googleEmail
    }
  })
  // si le recipient ne figure pas dans la table
  if(recipientDonationExist < 1 )
  {
    // on enregistre le don du connecté à recipient dans la table CollectionResult
    await prismadb.collectionResult.create({
      data: {
        donatorEmail: connectedProfile?.googleEmail,
        donatorProfileId: connectedProfile?.id,
        collectionId: collectionData?.collection?.id,
        amount : amountConcerned?.amount,
        currency : amountConcerned?.currency,
        collectionType: collectionData?.collection?.collectionType,
        recipientEmail : recipientProfile?.profile?.googleEmail,
        recipientProfileId: recipientProfile?.profile?.id,
        donationReceived: 1
      }
    }) 
  } // Il avait déjà reçu un premier don, alors ...
  else{
    // On enregistre d'abord le don
    await prismadb.collectionResult.create({
      data: {
        donatorEmail: connectedProfile?.googleEmail,
        collectionId: collectionData?.collection?.id,
        amount : amountConcerned?.amount,
        currency : amountConcerned?.currency,
        collectionType: collectionData?.collection?.collectionType,
        recipientEmail : recipientProfile?.profile?.googleEmail,
      }
    })
    // on compte le nombre de fois qu'il est recipient dans cette collecte
    const recipientNbr = await prismadb.collectionResult.count({
      where:{
        collectionId: collectionData?.collection?.id,
        recipientEmail: recipientProfile?.profile?.googleEmail
      }
    })
    // update de donationReceived à 2 
    await prismadb.collectionResult.updateMany({
      where: {
        collectionId: collectionData?.collection?.id,
        amount : amountConcerned?.amount, // mis exprès mais le connectionId aurait suffit
        currency : amountConcerned?.currency, // mis exprès mais le connectionId aurait suffit
        collectionType: collectionData?.collection?.collectionType, // mis exprès mais le connectionId aurait suffit
        recipientEmail : recipientProfile?.profile?.googleEmail,
      },
      data: { donationReceived: recipientNbr }
    })
  }
  // On update collectionParticipant on met hasgive du connected à true 
  await prismadb.collectionParticipant.updateMany({
    where: {
      collectionId: collectionData?.collection?.id,
      profileId: connectedProfile?.id
    },
    data: {
      hasGive: true
    }
  })
  if(recipientProfile?.profile && connectedProfile)
  {
    const metCount = await prismadb.profilesMet.count({
      where: {
        OR: [
          {
            profileId: connectedProfile?.id,
            participantMetId: recipientProfile?.profile?.id 
          },
          {
            profileId: recipientProfile?.profile?.id,
            participantMetId: connectedProfile?.id 
          },
        ]
      }
    })
    if(metCount < 1)
    {
      // On entre le recipient dans ProfileMet comme déjà renconté par le donator
      await prismadb.profilesMet.create({
        data: {
          profileId: connectedProfile?.id,
          participantMetId: recipientProfile?.profile?.id
        }
      })
    }
  }
  // On compte le nombre de ceux qui ont déjà donné, ou fait la désignation
  const allHasGiveCount = await prismadb.collectionParticipant.count({
    where: {
      collectionId: collectionData?.collection?.id,
      //
      hasGive: true
    }
  })
  // On vérifie si ceux qui ont donné sont == à ceux qui y participe
  if(collectionData?.collection?.group === allHasGiveCount)
  {
    // on close la collecte dans collection
    await prismadb.collection.updateMany({
      where: {
        id: collectionData?.collection?.id
      },
      data: {
        isCollectionClosed: true
      }
    })
  } 
    revalidatePath('/dashboard')
    redirect("/dashboard")
} // donation registered 
//

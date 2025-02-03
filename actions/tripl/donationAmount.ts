"use server";

import { CurrentProfile } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// à la place de params je peux mettre id (qui représente id du fichier donationId) 
  export async function donationAmountAction(params: string) {
  // params c'est l'id du recipient choisi (son id dans la table collecteParticipant)  
  const connected = await CurrentProfile()
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
      author: connected?.id,
      activity:  connected?.firstname + " a désigné : " + recipientProfile?.profile?.firstname + " pour recevoir le tripl de " + collectionData?.collection?.amount + collectionData?.collection?.currency + "."  // Json?
    }
  })
  // on verifie si le recipient avait dejà reçu un 1er don
  const recipientDonationExist = await prismadb.collectionResult.count({
    where: {
      collectionId: collectionData?.collection?.id,
      amount : amountConcerned?.amount,
      currency : amountConcerned?.currency,
      recipientProfileId : recipientProfile?.profile?.id
    }
  })
  // si le recipient ne figure pas dans la table
  // donc c'est la 1ere désignation qu'il reçoit
  if(recipientDonationExist < 1 )
  {
    // on enregistre le don du connecté à recipient dans la table CollectionResult
    await prismadb.collectionResult.create({
      data: {
        donatorProfileId: connected?.id,
        collectionId: collectionData?.collection?.id,
        amount : amountConcerned?.amount,
        currency : amountConcerned?.currency,
        recipientProfileId: recipientProfile?.profile?.id,
        donationReceived: 1
      }
    }) 
  } // S'il avait déjà reçu une 1ere désignation, alors ...
  else{
    // On enregistre d'abord la désignation
    await prismadb.collectionResult.create({
      data: {
        donatorProfileId: connected?.id,
        collectionId: collectionData?.collection?.id,
        amount : amountConcerned?.amount,
        currency : amountConcerned?.currency,
        recipientProfileId : recipientProfile?.profile?.id,
        donationReceived: 1
      }
    })
    // ensuite on update le donationReceived à 2 
    await prismadb.collectionResult.updateMany({
      where: {
        collectionId: collectionData?.collection?.id,
        amount : amountConcerned?.amount, // mis exprès mais le connectionId aurait suffit
        currency : amountConcerned?.currency, // mis exprès mais le connectionId aurait suffit
        recipientProfileId : recipientProfile?.profile?.id,
        donationReceived: 1
      },
      data: { donationReceived: 2 }
    })
  }
  //
  // #########
  //
  // On update collectionParticipant on met hasgive du connected à true 
  await prismadb.collectionParticipant.updateMany({
    where: {
      collectionId: collectionData?.collection?.id,
      profileId: connected?.id
    },
    data: {
      hasGive: true
    }
  })
  if(recipientProfile?.profile && connected)
  {
    // On entre le recipient dans ProfileMet comme déjà renconté par le donator
    await prismadb.profilesMet.create({
      data: {
        profileId: connected?.id,
        participantMetId: recipientProfile?.profile?.id
      }
    })
  }
  //
  // ##########################
  //
  // On compte le nombre de ceux qui ont déjà donné, ou fait la désignation
  const allHasGiveCount = await prismadb.collectionParticipant.count({
    where: {
      collectionId: collectionData?.collection?.id,
      //
      hasGive: true
    }
  })
  // On vérifie si ceux qui ont donné sont == à ceux qui y participent
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
    // ON COUNT SI Y A UN PARTICIPANT QUI A REÇU 2 DESIGNATION
    const twoDesignationCount = await prismadb.collectionResult.count({
      where: {
        collectionId: collectionData?.collection?.id,
        donationReceived: 2 
      }
    })
    // S'IL Y A 1 PARTICIPANT QUI A REÇU 2 DÉSIGNATION 
    //(c'est à dire deux entrée dans la table collectionResult)
    if(twoDesignationCount === 2)
    {  
      // ON SELECT CELUI QUI A DONATION RECEIVED == 2
      const winner = await prismadb.collectionResult.findFirst({
        where: {
          collectionId : collectionData?.collection?.id,
          donationReceived: 2
        },
        orderBy: { id: "asc"} // pour ne prendre que le premier
      })
      // ON LUI DONNE LE TRIPL
      // ON SELECT SON CREDIT ET SON JACKPOT
      const winnerProfile = await prismadb.profile.findFirst({
        where: {
          id: winner?.recipientProfileId
        }
      })
      if(winnerProfile)
      {
        // On update son jackpot du montant initial x 3
        const jackpotReceived = (collectionData?.collection?.amount * 3)
        //
        await prismadb.profile.updateMany({
          where: { 
            id: winnerProfile?.id
          },
          data: { 
            // on augmente son jackpot
            jackpot: winnerProfile?.jackpot + jackpotReceived,
          }
        })
      }
    } // SI PERSONNE N'A REÇU DEUX DÉSIGNATIONS
    else{
      // ON RECREDITE CHAQUE PARTICIPANT DE SON AMOUNT DE DEPART
      const participant1 = await prismadb.collectionParticipant.findFirst({
        where: {
          collectionId: collectionData?.collection?.id,
          rank: 1
        }
      })
      // on select le credit du participant rank1
      const credit1 = await prismadb.profile.findFirst({
        where: { id: participant1?.profileId }
      })
      if(credit1)
      {
        // new crédit
        const newcredit1 = credit1?.credit + collectionData?.collection?.amount
        // on lui remet amount
        await prismadb.profile.updateMany({
          where: {
           id: participant1?.profileId
          },
          data: { credit: newcredit1 }
        })
      }
      // ############# 2 ##############
      const participant2 = await prismadb.collectionParticipant.findFirst({
        where: {
          collectionId: collectionData?.collection?.id,
          rank: 2
        }
      })
      // on select le credit du participant rank2
      const credit2 = await prismadb.profile.findFirst({
        where: { id: participant2?.profileId }
      })
      if(credit2)
      {
        // new crédit
        const newcredit2 = credit2?.credit + collectionData?.collection?.amount
        // on lui remet amount
        await prismadb.profile.updateMany({
          where: {
           id: participant2?.profileId
          },
          data: { credit: newcredit2 }
        })
      }
      // ################ 3 ######################
      const participant3 = await prismadb.collectionParticipant.findFirst({
        where: {
          collectionId: collectionData?.collection?.id,
          rank: 3
        }
      })
      // on select le credit du participant rank3
      const credit3 = await prismadb.profile.findFirst({
        where: { id: participant3?.profileId }
      })
      if(credit3)
      {
        // new crédit
        const newcredit3 = credit3?.credit + collectionData?.collection?.amount
        // on lui remet amount
        await prismadb.profile.updateMany({
          where: {
           id: participant3?.profileId
          },
          data: { credit: newcredit3 }
        })
      }
    }
  }
    revalidatePath('/dashboard')
    redirect("/dashboard")
} // donation registered 
//

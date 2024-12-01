"use server";

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

 
// à la place de params je peux mettre id (qui représente id du fichier donationId) 
  export async function donationInOneofusAction(params: string) {
  // params c'est l'id du recipient choisi (son id dans la table collecteParticipant)  
  //const connected = await currentUserInfos()
  // ##4 test##
  const connectedtestor = await prismadb.currentProfileForTest.findFirst()
  //
  const connected = await prismadb.profile.findFirst({
    where: { usercodepin: connectedtestor?.usercodepin}
  })
  // ### AND 4 TEST ####
  // recipient profile datas 
  const recipient:any = await prismadb.collectionParticipant.findFirst({
    where: { id: params },
    include: { profile: true },
  })
  // collection data
  const collectionConcerned:any = await prismadb.collection.findFirst({
    where: { id: recipient?.collectionId },
  })
  //
// ######################################
  // Activity Registration
  // TODO: here
  // ## On vérifie si le connecté est dans cette collecte, et s'il n'a pas encore désigné un recipient
  const connectedExistAndHasNotYetDesignatedCount = await prismadb.collectionParticipant.count({
    where: { 
      collectionId: recipient?.collectionId,
      profileId: connected?.id,
      hasGive: false
    }
  })
  if(connectedExistAndHasNotYetDesignatedCount === 1)
  {
    // On update collectionParticipant on met hasgive du connected à true 
    await prismadb.collectionParticipant.updateMany({
      where: {
        collectionId: collectionConcerned?.id,
        profileId: connected?.id
      },
      data: {
        hasGive: true
      }
    })
    // on verifie si le recipient avait dejà reçu une 1ere désignation
    const recipientDesignationExist = await prismadb.collectionResult.count({
      where: {
        collectionId: collectionConcerned?.id,
        recipientProfileId : recipient?.profile?.id
      }
    })
    // si le recipient ne figure pas dans la table
    if(recipientDesignationExist < 1 )
    {
      // on enregistre la désignation du recipient par le connected dans la table CollectionResult
      await prismadb.collectionResult.create({
        data: {
          donatorEmail: connected?.googleEmail,
          donatorProfileId: connected?.id,
          collectionId: collectionConcerned?.id,
          amount : collectionConcerned?.amount,
          currency : collectionConcerned?.currency,
          collectionType: collectionConcerned?.collectionType,
          recipientEmail : recipient?.profile?.googleEmail,
          recipientProfileId: recipient?.profile?.id,
          donationReceived: 1
        }
      }) 
    } // Il avait déjà été désigné, alors ...
    else{
      // On enregistre d'abord la nouvelle désignation
      await prismadb.collectionResult.create({
        data: {
          donatorEmail: connected?.googleEmail,
          donatorProfileId: connected?.id,
          collectionId: collectionConcerned?.id,
          amount : collectionConcerned?.amount,
          currency : collectionConcerned?.currency,
          collectionType: collectionConcerned?.collectionType,
          recipientEmail : recipient?.profile?.googleEmail,
          recipientProfileId: recipient?.profile?.id,
          donationReceived: 1
        }
      })
      // on select le donationReceived du recipient
      const receivedDesignation = await prismadb.collectionResult.findFirst({
        where: {
          collectionId: collectionConcerned?.id,
          recipientProfileId: recipient?.profile?.id,
        }
      })
      // update de donationReceived de + 1
      if( receivedDesignation )
      {
        await prismadb.collectionResult.updateMany({
          where: {
            collectionId: collectionConcerned?.id,
            recipientProfileId : recipient?.profile?.id,
          },
          data: { donationReceived: receivedDesignation?.donationReceived + 1 }
        })
      }
    }
    // On les enregistre comme s'étant déjà croisé
    if(recipient && connected)
    {
      // On entre le recipient dans ProfileMet comme déjà renconté par le donator
      await prismadb.profilesMet.create({
        data: {
          profileId: connected?.id,
          profilecodepin:connected?.usercodepin,
          participantMetId: recipient?.profile?.id,
          participantcodepin: recipient?.profile?.usercodepin
        }
      })
    }
    // On compte le nombre de ceux qui ont déjà fait la désignation
    const allHasGiveCount = await prismadb.collectionParticipant.count({
      where: {
        collectionId: collectionConcerned?.id,
        //
        hasGive: true
      }
    })
    // On vérifie si ceux qui ont désigné sont == à ceux qui y participe
    if(collectionConcerned?.group === allHasGiveCount)
    {
      // on close la collecte dans collection
      await prismadb.collection.updateMany({
        where: {
          id: collectionConcerned?.id
        },
        data: {
          isCollectionClosed: true
        }
      })
      // On select les nombres de désignation reçu par ordre décroissant
      const receivers = await prismadb.collectionResult.findMany({
        where: { collectionId: collectionConcerned?.id },
        orderBy: {
          donationReceived: 'desc',
        },
      });
      // on isole le plus grand nombre de désignation reçu
      const maxDesignation = receivers[0]?.donationReceived;
      // on select tout participant qui a reçu le plus gran nombre de désignation
      const receiversWithMaxDesignation = receivers.filter((receiver) => receiver.donationReceived === maxDesignation);

      // on compte combien de participant ont réçu le plus grand nombre de désignation 
      const winnercount = receiversWithMaxDesignation.length;
      // CECI c'est la cagnotte que le ou les participants ayant le plus grand nombre
      // de désignation vont se partager
      const jackpotToGive = collectionConcerned?.amount * collectionConcerned?.group
      // la part que chacun recevra de la cagnotte
      const jackpotPerWinner = jackpotToGive / winnercount

      /*  TODO: LORSQU'IL Y A PLUSIEURS WINNER
      // on donne a chaque winner (celui ou ceux qui ont été le plus désigné) sa part
      receiversWithMaxDesignation.map(async (receiver) => {
        // on isole les entiers et les centimes
        const jackpotCentsPerWinner = Math.round((jackpotPerWinner - Math.floor(jackpotPerWinner)) * 100);
        
        TODO: il faut d'abord select le jackpot et le jackpotCent de chacun
        pour y additionner  jackpotPerWinner et jackpotCentsPerWinner
        //
        await prisma.profile.update({
          where: { id: user.id },
            data: {
              jackpot: Math.floor(jackpotPerWinner), // La partie entière en dollars
              jackpotCents: jackpotCentsPerWinner, // La partie centimes
            },
          });
        
        
      }) */

    } 
  }else{
    redirect("/dashboard")
  }
  revalidatePath(`/dashboard/${collectionConcerned?.id}`)
  redirect(`/dashboard/${collectionConcerned?.id}`)
} // donation registered 
//
//
/*
    await prisma.user.update({
      where: { id: user.id },
      data: {
        gift: Math.floor(giftPerUser), // La partie entière en dollars
        giftCents: giftCents, // La partie centimes
      },
    });

 */
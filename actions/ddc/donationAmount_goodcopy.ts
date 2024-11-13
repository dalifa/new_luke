"use server";
//
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// à la place de params je peux mettre id (qui représente id du fichier donationId) 
  export async function donationAmountAction(params: string) {
    const metric = await prismadb.metric.findFirst()
  // params c'est l'id du recipient choisi (son id dans la table collecteParticipant)  
  // le donator = le connecté
  const connected = await currentUserInfos()
  // recipient
  const recipient = await prismadb.collectionParticipant.findFirst({
    where: { id: params },
    include: { profile: true },
  })
  // collection data
  const collectionData = await prismadb.collectionParticipant.findFirst({
    where: { id: params },
    include: { collection: true }
  })
  // s'ils existent
  if(connected && recipient && collectionData?.collection)
  {
    // si le connecté n'est pas le recipient
    if(connected?.id !== recipient?.profile?.id)
    {
      // 1- on débite le crédit du connecté de amount
      await prismadb.profile.updateMany({
        where: {
          id: connected?.id
        },
        data: { 
          credit: connected?.credit - collectionData?.collection?.amount, 
          // on update son ddcGiven à 
          ddcGiven: connected?.ddcGiven + collectionData?.collection?.amount
        }
      })
      // 2- on crédite le compte du recipient de amount 
      await prismadb.profile.updateMany({
        where: {
          id: recipient?.profile?.id
        },
        data: { 
          jackpot: recipient?.profile?.jackpot + collectionData?.collection?.amount,
          // on update son ddcReceived
          ddcReceived: recipient?.profile?.ddcReceived +  collectionData?.collection?.amount
        }
      })
      // on update le mondant total des dons fait sur le site
      if(metric)
      {
        await prismadb.metric.updateMany({
          data: {totalDdcGiven: metric?.totalDdcGiven + collectionData?.collection?.amount }
        }) 
      }
      // 3- on met donationCollected à + 1
      await prismadb.collection.updateMany({
        where: {
          id: collectionData?.collection?.id
        },
        data: {
          donationCollected: collectionData?.collection?.donationCollected + 1
        }
      })
      // on vérifie si le nombre de donation reçu = group 
      const donationCollectedCount = await prismadb.collection.findFirst({
        where: {
          id: collectionData?.collection?.id
        },
      }) // on close la collecte si le nbre de don = group
      if(donationCollectedCount?.donationCollected === donationCollectedCount?.group)
      {
        await prismadb.collection.updateMany({
          where: {
            id: collectionData?.collection?.id
          },
          data:{
            isCollectionClosed: true
          }
        })
      }
      // 4- on verifie si le recipient avait dejà reçu un 1er don
      const recipientDonationExist = await prismadb.collectionResult.count({
        where: {
          collectionId: collectionData?.collection?.id,
          recipientProfileId : recipient?.profile?.id
        }
      })
      // 5- si le recipient ne figure pas dans la table
      if(recipientDonationExist < 1 )
      {
        // on enregistre le don du connecté à recipient dans la table CollectionResult
        await prismadb.collectionResult.create({
          data: {
            donatorEmail: connected?.googleEmail,
            donatorProfileId: connected?.id,
            collectionId: collectionData?.collection?.id,
            amount : collectionData?.collection?.amount,
            currency : collectionData?.collection?.currency,
            collectionType: collectionData?.collection?.collectionType,
            recipientEmail : recipient?.profile?.googleEmail,
            recipientProfileId: recipient?.profile?.id,
            donationReceived: 1
          }
        }) 
      } // Il avait déjà reçu un premier don, alors ...
      else{
        // On enregistre d'abord le don
        await prismadb.collectionResult.create({
          data: {
            donatorEmail: connected?.googleEmail,
            collectionId: collectionData?.collection?.id,
            amount : collectionData?.collection?.amount,
            currency : collectionData?.collection?.currency,
            collectionType: collectionData?.collection?.collectionType,
            recipientEmail : recipient?.profile?.googleEmail,
            recipientProfileId: recipient?.profile?.id,
            donationReceived: 1
          }
        })
        // l'entrée crée
        const justAdded = await prismadb.collectionResult.findFirst({
          where: {
            collectionId: collectionData?.collection?.id,
            recipientProfileId : recipient?.profile?.id,
          }
        })
        if(justAdded)
        {
          // update de donationReceived à + 1 
          await prismadb.collectionResult.updateMany({
            where: {
              collectionId: collectionData?.collection?.id,
              recipientProfileId : recipient?.profile?.id,
            },
            data: { donationReceived: justAdded?.donationReceived + 1 }
          })
        }
      }
      //
      if(recipient?.profile && connected)
      {
        // 6- On entre le recipient dans ProfileMet comme déjà renconté par le donator
        await prismadb.profilesMet.create({
          data: {
            profileId: connected?.id,
            participantMetId: recipient?.profile?.id
          }
        })
      }  
      // 7- On entre le connected dans la liste suivante , s'il n'y en a pas on en crée et on l'y entre 
        // on vérifie s'il y a une autre collecte ddc de même montant d'ouvert
        const anotherCollectionExist = await prismadb.collection.count({
          where: { 
            amount: collectionData?.collection?.amount,
            collectionType: collectionData?.collection?.collectionType,
            isGroupComplete: false,
            id: {
              not: collectionData?.collection?.id
            },
          }
        })
        // il n'en exist pas d'ouvert, 
        if( anotherCollectionExist < 1  && collectionData?.collection )
        {
          // ON CRÉE UNE COLLECTE ET ON L'ENTRE
          await prismadb.collection.create({
            data: {
              amount: collectionData?.collection?.amount,
              collectionType: collectionData?.collection?.collectionType,
              group: metric?.currentDdcGroup,
              groupStatus: 1
            }
          })
          // on select id de la collecte juste créée
          const justCreatedCollection = await prismadb.collection.findFirst({
            where: {
              amount: collectionData?.collection?.amount,
              collectionType: collectionData?.collection?.collectionType,
              groupStatus: 1,
              isGroupComplete: false,
              // id différent de la collecte en cours
              id: {
                not: collectionData?.collection?.id
              },
            }
          })
          // on l'entre dans collectionParticipant 
          if(justCreatedCollection)
          {
            await prismadb.collectionParticipant.create({
              data: {
                collectionId: justCreatedCollection?.id,
                rank: 1,
                profileId: connected?.id
              }
            })
          }
          // ### CECI EST PROVISOIR PARCEQUE GROUP = 1
        /*  await prismadb.collection.updateMany({
            where: {
              id: justCreatedCollection?.id
            },
            data: { isGroupComplete: true }
          }) */
          // ### fin du provisoir ####################
        } 
        // s'il y en a une d'ouvert
        if( anotherCollectionExist === 1 && collectionData?.collection)
        {
          // on select la collecte ouvert et non celle qui est en cour
          const nextCollection = await prismadb.collection.findFirst({
            where: {
              amount: collectionData?.collection?.amount,
              collectionType: collectionData?.collection?.collectionType,
              isGroupComplete: false,
              // id différent de la collecte en cours
              id: {
                not: collectionData?.collection?.id
              },
            }
          })
          if(nextCollection)
          {
            // on l'y entre
            await prismadb.collectionParticipant.create({
              data: {
                collectionId: nextCollection?.id,
                rank: nextCollection?.groupStatus + 1,
                profileId: connected?.id
              }
            })
            // on update groupstatus de + 1
            await prismadb.collection.updateMany({
              where: {
                id: nextCollection?.id,
              },
              data: {
                groupStatus: nextCollection?.groupStatus + 1,
              }
            })
            // si le group est complet, on met isGroupComplete à true
            if(nextCollection?.groupStatus + 1 === nextCollection?.group)
            {
              await prismadb.collection.updateMany({
                where: {
                  id: nextCollection?.id,
                },
                data: {
                  isGroupComplete: true,
                }
              })
            }
          }
        }
      // TODO: activity
    }
  }
    revalidatePath('/dashboard')
    redirect("/dashboard")
} // donation registered 
//
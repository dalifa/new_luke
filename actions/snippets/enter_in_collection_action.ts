"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
//
export const enterInSnippetsAction = async (params: string) => {
  try {
    // pour a voir le nombre de participants en cours, dans le groupe 
    const metric = await prismadb.metric.findFirst()
    const currentGroup = metric?.currentGroup
    //
    const amountConcerned = await prismadb.amount.findFirst({
      where: { id: params }
    });
    //
    const ctype = "snippets";
    const connected = await CurrentProfile();

    // SI LE CONNECTÉ A UNE COLLECT DE CE AMOUNT AVEC RECEPTION NON VALIDÉ
    const existingPendingParticipation = await prismadb.collectionParticipant.findFirst({
      where: {
        recipientValidation: false,
        amountId: amountConcerned?.id,
        onStandBy: false,
        OR: [
          { participantId: connected?.id }, // il est donateur
          { recipientId: connected?.id } // ou destinataire
        ]
      }
    });
    // IL N'A PAS DE COLLECTE AVEC RECEPTION NON VALIDÉ
    if (!existingPendingParticipation) {
      // COMBIEN DE COLLECT DE CE AMOUNT SON OUVERTE ?
      const openCollectionCount = await prismadb.collection.count({
        where: {
          amountId: amountConcerned?.id,
          isGroupComplete: false,
          collectionType: ctype,
        },
      });
      // S'IL Y A ZÉRO COLLECTE D'OUVERTE
      if (openCollectionCount === 0 && amountConcerned) {
        // ## ON EN CRÉE UNE NOUVELLE
        const newCollection = await prismadb.collection.create({
          data: {
            amountId: amountConcerned?.id,
            currency: connected?.currency,
            collectionType: ctype,
            groupStatus: 1,
            group: currentGroup // nombre actuel de participants autorisé
          }
        });
        if (newCollection && connected) {
          // ## ON L'Y ENTRE COMME PARTICIPANT 1
          await prismadb.collectionParticipant.create({
            data: {
              collectionId: newCollection?.id,
              amountId: amountConcerned?.id,
              concernedAmount: amountConcerned?.amount,
              rank: 1,
              participantId: connected?.id
            }
          });
        }
      }
      // ##########################################################
      // ##########################################################
      // S'IL Y A 1 COLLECTE D'OUVERTE
      if (openCollectionCount === 1 && amountConcerned && connected) {
        const existingCollection = await prismadb.collection.findFirst({
          where: {
            amountId: amountConcerned?.id,
            isGroupComplete: false,
            collectionType: ctype,
          },
        });
      
        if (!existingCollection) return;
      
        const currentGroupStatus = existingCollection?.groupStatus;
      
        // Récupérer tous les participants existants
        const existingParticipants = await prismadb.collectionParticipant.findMany({
          where: {
            collectionId: existingCollection?.id,
            onStandBy: false // qui n'ont pas quitté
          },
          orderBy: {
            rank: 'asc',
          }
        });
        // Vérification de rencontres passées
        const hasAlreadyMet = async () => {
          for (const participant of existingParticipants) {
            const count = await prismadb.alreadyMet.count({
              where: {
                OR: [
                  {
                    profileId: connected?.id,
                    profileMetId: participant?.participantId
                  },
                  {
                    profileId: participant?.participantId,
                    profileMetId: connected?.id
                  }
                ]
              }
            });
            if (count > 0) return true;
          }
          return false;
        };
      
        if (await hasAlreadyMet()) {
          // Créer une nouvelle collecte si rencontre détectée
          const newCollection = await prismadb.collection.create({
            data: {
              amountId: amountConcerned.id,
              currency: connected.currency,
              collectionType: ctype,
              groupStatus: 1,
              group: currentGroup // nombre actuel de participants autorisé
            }
          });
          // on l'entre dans la nouvelle collecte comme rank 1
          await prismadb.collectionParticipant.create({
            data: {
              collectionId: newCollection.id,
              amountId: amountConcerned.id,
              concernedAmount: amountConcerned.amount,
              rank: 1,
              participantId: connected.id
            }
          });
          return;
        }
      
        // Si aucune rencontre → on l’ajoute à la collecte existante

        // On vérifie s'il n'y a pas de onStandBy à true
        const standByCount = await prismadb.collectionParticipant.count({
          where:{
            collectionId: existingCollection.id,
            onStandBy: true
          }
        })
        
        const newRank = currentGroupStatus + 1;
        const isGroupNowComplete = newRank === existingCollection?.group;
      
        // s'il n'y a pas de onStandBy === true
        if(standByCount === 0)
        {
            await prismadb.collectionParticipant.create({
            data: {
              collectionId: existingCollection.id,
              amountId: amountConcerned.id,
              concernedAmount: amountConcerned.amount,
              rank: newRank,
              participantId: connected.id
            }
          });
        }
        else{
          // s'il y a au moins 1 onStandBy === true
          // on l'entre a cette place là
          const firstStandBy = await prismadb.collectionParticipant.findFirst({
            where: {
              collectionId: existingCollection?.id,
              onStandBy: true
            }
          })
          // ON ENTRE LE CONNECTÉ À LA PLACE DU 1ER PARTICIPANT ID OÙ ONSTANBY === TRUE
          await prismadb.collectionParticipant.updateMany({
            where: {
              id: firstStandBy?.id // l'ancien participant
            },
            data: {
              participantId: connected.id, // le nouveau qui le remplace
              onStandBy: false
            }
          });
        }
          await prismadb.collection.update({
            where: { id: existingCollection.id },
            data: {
              groupStatus: newRank,
              ...(isGroupNowComplete && { isGroupComplete: true })
            }
          });

          // TODO: envoyer les notifications email si groupe complet
      }      
      // ################################################################
      // ################################################################
      // IL Y A PLUS D'UNE COLLECTE D'OUVERTE
        if (openCollectionCount > 1 && amountConcerned && connected) {
          // Récupère toutes les collectes ouvertes correspondantes
          const openCollections = await prismadb.collection.findMany({
            where: {
              amountId: amountConcerned.id,
              isGroupComplete: false,
              collectionType: ctype,
            },
            orderBy: {
              createdAt: "asc" // Pour tenter d'entrer dans la plus ancienne d'abord
            }
          });
        
          let inserted = false;
        
          for (const coll of openCollections) {
            const participants = await prismadb.collectionParticipant.findMany({
              where: { 
                collectionId: coll.id,
                onStandBy: false // quand personne n'a quitté
              },
              orderBy: { rank: "asc" }
            });
        
            // Vérification des rencontres avec chaque participant
            let hasMetSomeone = false;
        
            for (const participant of participants) {
              const alreadyMet = await prismadb.alreadyMet.count({
                where: {
                  OR: [
                    {
                      profileId: connected.id,
                      profileMetId: participant.participantId
                    },
                    {
                      profileId: participant.participantId,
                      profileMetId: connected.id
                    }
                  ]
                }
              });
        
              if (alreadyMet > 0) {
                hasMetSomeone = true;
                break; // Pas besoin de continuer si une rencontre est trouvée
              }
            }
        
            // Si aucun des participants n'a déjà été rencontré
            if (!hasMetSomeone) {
              const newRank = participants.length + 1;

              // On vérifie s'il n'y a pas de onStandBy à true
              const standByCount = await prismadb.collectionParticipant.count({
                where:{
                  collectionId: coll.id,
                  onStandBy: true
                }
              })
              if(standByCount === 0)
              {
                await prismadb.collectionParticipant.create({
                  data: {
                    collectionId: coll.id,
                    amountId: amountConcerned.id,
                    concernedAmount: amountConcerned.amount,
                    rank: newRank,
                    participantId: connected.id
                  }
                });
              }else{
                // on select le standBy
                const firstStandBy = await prismadb.collectionParticipant.findFirst({
                  where: {
                    collectionId: coll.id,
                    onStandBy: true
                  }
                })
                // On l'entre à la place
                await prismadb.collectionParticipant.updateMany({
                  where: {
                    collectionId: coll?.id,
                    id: firstStandBy?.id // l'ancien participant
                  },
                  data: {
                    participantId: connected.id, // le nouveau
                    onStandBy: false
                  }
                });
              }
              
              // Mise à jour du groupStatus
              const updateData: any = { groupStatus: newRank };
              if (newRank === coll?.group) updateData.isGroupComplete = true;
        
              await prismadb.collection.update({
                where: { id: coll.id },
                data: updateData
              });
        
              inserted = true;
              /* 
                TODO: envoie d'emails si groupe complet
                if(newRank === coll?.group){
                  // envoie emails à tous ici
                } 
              */
              break; // On sort de la boucle : insertion réussie
            }
          }
        
          // Si aucune collecte compatible n'a été trouvée, on en crée une nouvelle
          if (!inserted) {
            const newCollection = await prismadb.collection.create({
              data: {
                amountId: amountConcerned.id,
                currency: connected.currency,
                collectionType: ctype,
                groupStatus: 1,
                group: currentGroup // nombre actuel de participants autorisé
              }
            });
        
            await prismadb.collectionParticipant.create({
              data: {
                collectionId: newCollection.id,
                amountId: amountConcerned.id,
                concernedAmount: amountConcerned.amount,
                rank: 1,
                participantId: connected.id
              }
            });
          }
        }
    }
    revalidatePath("/dashboard"); 
    // redirect("/dashboard"); 
    return { success: true };
  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};

//################# 
/*

*/
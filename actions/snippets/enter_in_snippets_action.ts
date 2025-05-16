"use server";
//
import { CurrentProfile } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 
//
export const enterInSnippetsAction = async (params: string) => {
  try {
    const amountConcerned = await prismadb.amount.findFirst({
      where: { id: params }
    });
    const ctype = "snippets";
    const connected = await CurrentProfile();

    // SI LE CONNECTÉ A UNE COLLECT DE CE AMOUNT AVEC RECEPTION NON VALIDÉ
    const existingPendingParticipation = await prismadb.collectionParticipant.findFirst({
      where: {
        recipientValidation: false,
        amountId: amountConcerned?.id,
        OR: [
          { donorId: connected?.id },
          { potentialRecipient: connected?.id }
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
            amountId: amountConcerned.id,
            currency: connected?.currency,
            collectionType: ctype,
            groupStatus: 1
          }
        });
        if (newCollection && connected) {
          // ## ON L'Y ENTRE COMME PARTICIPANT 1
          await prismadb.collectionParticipant.create({
            data: {
              collectionId: newCollection.id,
              amountId: amountConcerned.id,
              concernedAmount: amountConcerned.amount,
              rank: 1,
              potentialRecipient: connected.id
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
            amountId: amountConcerned.id,
            isGroupComplete: false,
            collectionType: ctype,
          },
        });
      
        if (!existingCollection) return;
      
        const currentGroupStatus = existingCollection.groupStatus;
      
        // Récupérer tous les participants existants
        const existingParticipants = await prismadb.collectionParticipant.findMany({
          where: {
            collectionId: existingCollection.id,
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
                    profileId: connected.id,
                    profileMetId: participant.potentialRecipient
                  },
                  {
                    profileId: participant.potentialRecipient,
                    profileMetId: connected.id
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
              groupStatus: 1
            }
          });
          // on l'entre
          await prismadb.collectionParticipant.create({
            data: {
              collectionId: newCollection.id,
              amountId: amountConcerned.id,
              concernedAmount: amountConcerned.amount,
              rank: 1,
              potentialRecipient: connected.id
            }
          });
          return;
        }
      
        // Si aucune rencontre → on l’ajoute à la collecte existante
        const newRank = currentGroupStatus + 1;
        const isGroupNowComplete = newRank === 4;
      
        await prismadb.collectionParticipant.create({
          data: {
            collectionId: existingCollection.id,
            amountId: amountConcerned.id,
            concernedAmount: amountConcerned.amount,
            rank: newRank,
            potentialRecipient: connected.id
          }
        });
      
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
              where: { collectionId: coll.id },
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
                      profileMetId: participant.potentialRecipient
                    },
                    {
                      profileId: participant.potentialRecipient,
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
        
              await prismadb.collectionParticipant.create({
                data: {
                  collectionId: coll.id,
                  amountId: amountConcerned.id,
                  concernedAmount: amountConcerned.amount,
                  rank: newRank,
                  potentialRecipient: connected.id
                }
              });
        
              // Mise à jour du groupStatus
              const updateData: any = { groupStatus: newRank };
              if (newRank === 4) updateData.isGroupComplete = true;
        
              await prismadb.collection.update({
                where: { id: coll.id },
                data: updateData
              });
        
              inserted = true;
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
                groupStatus: 1
              }
            });
        
            await prismadb.collectionParticipant.create({
              data: {
                collectionId: newCollection.id,
                amountId: amountConcerned.id,
                concernedAmount: amountConcerned.amount,
                rank: 1,
                potentialRecipient: connected.id
              }
            });
          }
        }
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
  } catch (error) {
    console.error("❌ ERROR:", error);
  }
};

//#################
/*
// S'IL Y A 1 COLLECTE D'OUVERTE
      if (openCollectionCount === 1 && amountConcerned && connected) {
        // On select la collecte en question
        const existingCollection = await prismadb.collection.findFirst({
          where: {
            amountId: amountConcerned?.id,
            isGroupComplete: false,
            collectionType: ctype,
          },
        });
        // #### S'IL Y A UN SEUL PARTICIPANT ####
          if(existingCollection?.groupStatus === 1)
          {
            // On select le participant en question
            const participant1 = await prismadb.collectionParticipant.findFirst({
              where: { rank: 1}
            })
            // on vérifie que le connecté n'a pas déjà donné ou reçu de lui
            const alreadyMetVerif = await prismadb.alreadyMet.count({
              where: {
                OR: [
                  {
                    profileId: connected?.id,
                    profileMetId: participant1?.potentialRecipient
                  },
                  {
                    profileId: participant1?.potentialRecipient,
                    profileMetId: connected?.id
                  }
                ]
              }
            });
            // s'ils ne se sont jamais rencontré
            if(alreadyMetVerif === 0)
            {
              // On entre le connecté dans cette collecte
              await prismadb.collectionParticipant.create({
                data: {
                  collectionId: existingCollection.id,
                  amountId: amountConcerned.id,
                  concernedAmount: amountConcerned.amount,
                  rank: 2,
                  potentialRecipient: connected.id
                }
              });
              // on update groupStatus
              await prismadb.collection.updateMany({
                where: {id: existingCollection?.id },
                data: { groupStatus: 2}
              })
            }else{
              // s'ils se sont déjà rencontrés
              // on crée un nouvelle collecte 
              const newCollection = await prismadb.collection.create({
                data: {
                  amountId: amountConcerned.id,
                  currency: connected?.currency,
                  collectionType: ctype,
                  groupStatus: 1
                }
              });
              // On y entre le connecté comme 1er participant
              if (newCollection && connected) {
                await prismadb.collectionParticipant.create({
                  data: {
                    collectionId: newCollection.id,
                    amountId: amountConcerned.id,
                    concernedAmount: amountConcerned.amount,
                    rank: 1,
                    potentialRecipient: connected.id
                  }
                });
              }
            }
          }
          // #####################################
          // #### S'IL Y A DÉJÀ DEUX PARTICIPANTS ####
          if(existingCollection?.groupStatus === 2)
          {
            // On select le 1er participant
            const participant1 = await prismadb.collectionParticipant.findFirst({
              where: { rank: 1}
            })
            // on vérifie que le connecté ne l'a pas déjà croisé
            const alreadyMetVerif1 = await prismadb.alreadyMet.count({
              where: {
                OR: [
                  {
                    profileId: connected?.id,
                    profileMetId: participant1?.potentialRecipient
                  },
                  {
                    profileId: participant1?.potentialRecipient,
                    profileMetId: connected?.id
                  }
                ]
              }
            });
            // On select le 2eme participant
            const participant2 = await prismadb.collectionParticipant.findFirst({
              where: { rank: 2}
            })
            // on vérifie que le connecté ne l'a pas déjà croisé
            const alreadyMetVerif2 = await prismadb.alreadyMet.count({
              where: {
                OR: [
                  {
                    profileId: connected?.id,
                    profileMetId: participant2?.potentialRecipient
                  },
                  {
                    profileId: participant2?.potentialRecipient,
                    profileMetId: connected?.id
                  }
                ]
              }
            });
            // si le connecté n'a rencontré aucun des deux
            if(alreadyMetVerif1 === 0 && alreadyMetVerif2 === 0)
            {
              // On entre le connecté dans la collecte
              await prismadb.collectionParticipant.create({
                data: {
                  collectionId: existingCollection.id,
                  amountId: amountConcerned.id,
                  concernedAmount: amountConcerned.amount,
                  rank: 3,
                  potentialRecipient: connected.id
                }
              });
              // on update groupstatus
              await prismadb.collection.updateMany({
                where: {id: existingCollection?.id },
                data: { groupStatus: 3}
              })
            }else{
              // s'il a rencontré ne fus qu'1 des deux
              // On crée une nouvelle collecte 
              const newCollection = await prismadb.collection.create({
                data: {
                  amountId: amountConcerned.id,
                  currency: connected?.currency,
                  collectionType: ctype,
                  groupStatus: 1
                }
              });
              // On select la collecte créée
              if (newCollection && connected) {
                // et on y entre le connecté comme 1er participant
                await prismadb.collectionParticipant.create({
                  data: {
                    collectionId: newCollection.id,
                    amountId: amountConcerned.id,
                    concernedAmount: amountConcerned.amount,
                    rank: 1,
                    potentialRecipient: connected.id
                  }
                });
              }
            }
          }
          // #####################################
          // #### S'IL Y A DÉJÀ TROIS PARTICIPANTS ####
          if(existingCollection?.groupStatus === 3)
          {
            // On le select le 1er participant
            const participant1 = await prismadb.collectionParticipant.findFirst({
              where: { rank: 1}
            })
            // On vérifie que le connecté n'a pas déjà donné ou reçu de lui
            const alreadyMetVerif1 = await prismadb.alreadyMet.count({
              where: {
                OR: [
                  {
                    profileId: connected?.id,
                    profileMetId: participant1?.potentialRecipient
                  },
                  {
                    profileId: participant1?.potentialRecipient,
                    profileMetId: connected?.id
                  }
                ]
              }
            });
            // On select le 2eme participant
            const participant2 = await prismadb.collectionParticipant.findFirst({
              where: { rank: 2}
            })
            // on vérifie que le connecté n'a pas déjà donné ou reçu de lui
            const alreadyMetVerif2 = await prismadb.alreadyMet.count({
              where: {
                OR: [
                  {
                    profileId: connected?.id,
                    profileMetId: participant2?.potentialRecipient
                  },
                  {
                    profileId: participant2?.potentialRecipient,
                    profileMetId: connected?.id
                  }
                ]
              }
            });
            // On select le 3eme participant
            const participant3 = await prismadb.collectionParticipant.findFirst({
              where: { rank: 3}
            })
            // on vérifie que le connecté n'a pas déjà donné ou reçu de lui
            const alreadyMetVerif3 = await prismadb.alreadyMet.count({
              where: {
                OR: [
                  {
                    profileId: connected?.id,
                    profileMetId: participant3?.potentialRecipient
                  },
                  {
                    profileId: participant3?.potentialRecipient,
                    profileMetId: connected?.id
                  }
                ]
              }
            });
            // Si le connecté n'a donné ni reçu d'aucun des trois
            if(alreadyMetVerif1 === 0 && alreadyMetVerif2 === 0 && alreadyMetVerif3 === 0)
            {
              // On l'entre dans la collecte
              await prismadb.collectionParticipant.create({
                data: {
                  collectionId: existingCollection.id,
                  amountId: amountConcerned.id,
                  concernedAmount: amountConcerned.amount,
                  rank: 4,
                  potentialRecipient: connected.id
                }
              });
              // On update groupStatus et isGroupComplete
              await prismadb.collection.updateMany({
                where: {id: existingCollection?.id },
                data: { 
                  groupStatus: 4,
                  isGroupComplete: true
                }
              })
              // TODO ici:
              // envoie de mail pour leur dire que leur groupe est complet
              // et qu'ils peuvent commencé à choisir leur destinataire respectif
            }else{
              // s'il a rencontré ne fus qu'1 des trois
              // on crée un nouvelle
              const newCollection = await prismadb.collection.create({
                data: {
                  amountId: amountConcerned.id,
                  currency: connected?.currency,
                  collectionType: ctype,
                  groupStatus: 1
                }
              });
              // On l'y entre
              if (newCollection && connected) {
                await prismadb.collectionParticipant.create({
                  data: {
                    collectionId: newCollection.id,
                    amountId: amountConcerned.id,
                    concernedAmount: amountConcerned.amount,
                    rank: 1,
                    potentialRecipient: connected.id
                  }
                });
              }
            }
          }
      }
*/
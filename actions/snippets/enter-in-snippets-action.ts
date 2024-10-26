"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// AMOUNT 1€ COLLECTION ENTER
export const enterInSnippetsAction = async (params:string) => {
  try 
  {
    // Le Montant concerné
    const concernedAmount = await prismadb.amount.findFirst({
      where: { id: params }
    })
    // Le next
    const metrics = await prismadb.metric.findFirst() // en prod
    //
    const ctype = "snippets"
    // Le profile du connecté
    const connected = await currentUserInfos() // en prod
    // 1- ON VERIFIE SON CREDIT
    if( connected?.credit && concernedAmount && connected.credit >= concernedAmount?.amount )
    {
      // ON DIMINU SON CREDIT DE concernedAmount.amount
      const newCredit = ( connected?.credit - concernedAmount?.amount )
      // 
      await prismadb.profile.updateMany({
        where: { 
          googleEmail: connected?.googleEmail 
        },
        data: { credit: newCredit }
      })
      // ON COMPTE COMBIEN Y'A DE COLLECTE D'OUVERT
      const openCollectionCount = await prismadb.collection.count({
        where: {
          amount: concernedAmount?.amount,
          isGroupComplete: false,
          collectionType: ctype,
        },
      })
      //
      // 2- S'IL Y A ZÉRO COLLECTION D'OUVERT DE CE MONTANT
      if(openCollectionCount === 0)
      {
        // ON CRÉE UNE COLLECTE ET ON L'ENTRE COMME PREMIER PARTICIPANT
        await prismadb.collection.create({
          data: {
            amount: concernedAmount?.amount,
            collectionType: ctype,
            groupStatus: 1
          }
        })
        // on select id de la collecte juste créée
        const justCreatedCollection = await prismadb.collection.findFirst({
          where: {
            amount: concernedAmount?.amount,
            collectionType: ctype,
            groupStatus: 1,
            isGroupComplete: false //
          }
        })
        //
        if(justCreatedCollection)
        {
          await prismadb.collectionParticipant.create({
            data: {
              collectionId: justCreatedCollection?.id,
              rank: 1,  // son rang sur 1er, 2eme, 3eme participant
              profileId: connected?.id
            }
          })
        }
      }
      //
      // 3- S'IL Y A 1 SNIPPETS D'OUVERT
      if( openCollectionCount === 1 )
      {
        // on select la collecte existante
        const existingOneCollection = await prismadb.collection.findFirst({
          where: {
            amount: concernedAmount?.amount,
            collectionType: ctype,
            isGroupComplete: false //
          }
        })
        // On vérifie s'il n'est pas déja dedans
        const alreadyInsideCount = await prismadb.collectionParticipant.count({
          where: {
            collectionId: existingOneCollection?.id,
            profileId: connected?.id
          }
        })
        // LE CONNECTE N'EST PAS DÉJÀ DANS LA COLLECTE OUVERTE
        if(alreadyInsideCount < 1)
        {
          // select le connected et ses participantsMet
          const currentProfile = await prismadb.profile.findFirst({
            where: { id: connected?.id },
            select: {
              profilesMets: {
                select: { participantMetId: true } // recuperer uniquement les Ids des anciens participant rencontrés
              },
              profilesOf: {
                select: { profileId: true } // inverser la relation pour anciens participants qui on rencontré le connecté
              }
            }
          })
          //
          if(currentProfile)
          {
            // extraires les Ids des anciens participants rencontrés des deux relations (profilesMets, profilesOf)
            const profilesMetsIds = [
              ...currentProfile.profilesMets.map((p) => p.participantMetId),
              ...currentProfile.profilesOf.map((p) => p.profileId)
            ]
            // recupérer les profileId des participants actuels à la collecte en cours
            const currentCollectionParticipants = await prismadb.collectionParticipant.findMany({
              where: { collectionId: existingOneCollection?.id},
              select: { profileId: true }
            })
            // vérifie si un des anciens profilesMet du connecté est dans cette collecte
            const hasProfilesMetInCollection = currentCollectionParticipants.some(participant => profilesMetsIds.includes(participant.profileId))
            // SI UN ANCIEN PARTICIPANT RENCONTRÉ EST DANS CETTE COLLECTE 
            if(hasProfilesMetInCollection)
            {
              // ON CRÉE UNE COLLECTE ET ON L'ENTRE COMME PREMIER PARTICIPANT
              await prismadb.collection.create({
                data: {
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 1
                }
              })
              // on select id de la collecte juste créée
              const justCreatedCollection = await prismadb.collection.findFirst({
                where: {
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 1,
                  isGroupComplete: false //
                },
                orderBy: { id: "desc" }
              })
              //
              if(justCreatedCollection)
              {
                await prismadb.collectionParticipant.create({
                  data: {
                    collectionId: justCreatedCollection?.id,
                    rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                    profileId: connected?.id
                  }
                })
              }
            }
            else{
              if(existingOneCollection)
              {
                // On l'entre dans la collecte en cours
                await prismadb.collectionParticipant.create({
                  data: {
                    collectionId: existingOneCollection?.id,
                    rank: existingOneCollection?.groupStatus + 1,  // son rang sur 1er, 2eme, 3eme participant
                    profileId: connected?.id
                  }
                })
                //
                await prismadb.collection.updateMany({
                  where: {
                    id: existingOneCollection?.id
                  },
                  data: { 
                    groupStatus: existingOneCollection?.groupStatus + 1
                  }
                })
                // on vérifie si le group est complet
                if(existingOneCollection?.group === existingOneCollection?.groupStatus + 1)
                {
                  // On met isGroupComplet === true
                  await prismadb.collection.updateMany({
                    where: {
                      id: existingOneCollection?.id
                    },
                    data: { 
                      isGroupComplete: true,
                      groupStatus: existingOneCollection?.groupStatus + 1
                    }
                  })
                }
              }
            }
          }
        } // IL EST DEJÀ DANS LA COLLECTE OUVERTE, ON CRÉE UNE COLLECTE ET ON L'ENTRE COMME PREMIER PARTICIPANT
        else{
          await prismadb.collection.create({
            data: {
              amount: concernedAmount?.amount,
              collectionType: ctype,
              groupStatus: 1
            }
          })
          // on select id de la collecte juste créée
          const justCreatedCollection = await prismadb.collection.findFirst({
            where: {
              amount: concernedAmount?.amount,
              collectionType: ctype,
              groupStatus: 1,
              isGroupComplete: false //
            },
            orderBy: { id: "desc"}
          })
          //
          if(justCreatedCollection)
          {
            await prismadb.collectionParticipant.create({
              data: {
                collectionId: justCreatedCollection?.id,
                rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                profileId: connected?.id
              }
            })
          }
        }
      }    
      //
      // 
      //## 4- S'IL Y A PLUS DE 1 COLLECTE D'OUVERT ########################
      if( openCollectionCount > 1 )
      { 
        // select le connected et ses participantsMet
        const currentProfile = await prismadb.profile.findFirst({
          where: { id: connected?.id },
          select: {
            profilesMets: {
              select: { participantMetId: true } // recuperer uniquement les Ids des anciens participant rencontrés
            },
            profilesOf: {
              select: { profileId: true } // inverser la relation pour anciens participants qui on rencontré le connecté
            }
          }
        })
        //
        if(currentProfile)
        {
          // extraires les Ids des anciens participants rencontrés des deux relations (profilesMets, profilesOf)
          const profilesMetsIds = [
            ...currentProfile.profilesMets.map((p) => p.participantMetId),
            ...currentProfile.profilesOf.map((p) => p.profileId)
          ]
          // recupérer toutes les collectes ouvertes
          const openCollections = await prismadb.collection.findMany({
            where: {
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false
            },
            include: { collectionParticipants: true } // participants à cette collecte
          })
          // parcourrir chaque collectes et vérifier les anciens participants déjà rencontré
          for (const collection of openCollections){
            const collectionParticipantsIds = collection.collectionParticipants.map(participant => participant.profileId)
            // verifier si le connecté est déjà dans cette collecte
            const isConnectedAlreadyInCollection = collectionParticipantsIds.includes(connected?.id)
            if(isConnectedAlreadyInCollection){
              continue; // on passe à la collecte suivante et on fait la même vérification
            }
            // vérifier si un ancien participant rencontré est dans la collecte
            const hasProfilesMetInCollection = collectionParticipantsIds.some(participantId => profilesMetsIds.includes(participantId))
            // s'il n'a pas d'anciens participants déjà rencontrés dans cette collecte
            if(!hasProfilesMetInCollection)
            {
              // ON L'ENTRE
              await prismadb.collectionParticipant.create({
                data: {
                  collectionId: collection?.id, // vient d'ici: for (const collection of openCollections)
                  profileId: connected?.id,
                  rank: collection?.groupStatus + 1
                }
              })
              //
              await prismadb.collection.updateMany({
                where: {
                  id: collection?.id
                },
                data: { 
                  isGroupComplete: true,
                  groupStatus: collection?.groupStatus + 1
                }
              })
              // si le groupe vient d'être complet
              if(collection?.group === collection?.groupStatus + 1)
              {
                await prismadb.collection.updateMany({
                  where: { id: collection?.id },
                  data: { isGroupComplete : true }
                })
              }
              //
              return  // On sort de la fonction après avoir ajouté le connecté dans la première collecte où il pouvait entrer
            }
          }
          // si le connecté est déjà dans les collectes ouvertes ou à au moins un ancien participant dans chacune d'elles
          // On crée un nouvelle et on l'entre comme le premier
          const newCollection = await prismadb.collection.create({
            data: {
              amount: concernedAmount?.amount,
              collectionType: ctype,
              groupStatus: 1
            }
          })
          // On entre le connecté
          await prismadb.collectionParticipant.create({
            data: {
              collectionId: newCollection?.id,
              profileId: connected?.id,
              rank: 1
            }
          })
        }
      }  
    }
  //
  } catch (error) {
  // mettre ici l'erreur  
  }
  revalidatePath('/dashboard');
  redirect('/dashboard')
}
//
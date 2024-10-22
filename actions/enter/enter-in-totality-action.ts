"use server";

import Collection from "@/app/(private)/dashboard/[collectionId]/page";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 
import { any } from "zod";

// COLLECTION ENTER TOTALITY
export const enterInTotalityCollectionAction = async (params:string) => {
  // LE MONTANT CHOISI PAR LE CONNECTÉ
  const concernedAmount = await prismadb.amount.findFirst({
    where: { id: params }
  })
  // LE TYPE DE COLLECTE
  const ctype = "totality"
    /*
      cgt    // Current Group Totality
      noit   // Next Own Id Totality
      noot   // Number Of Open Totality
      ###
      pour passer le nooc de 1 à 2 il n'y a aucune condition
      l'admin update le noot et le reste se fait naturellement
      pareil pour le cgt
    */
  const metrics = await prismadb.metric.findFirst() // en prod
  // LE PROFIL DU CONNECTÉ
  const connected = await currentUserInfos() // en prod
  // 1- ON VERIFIE SON CREDIT
    if( connected?.credit && concernedAmount && connected.credit >= concernedAmount?.amount )
    {
      // ON DIMINU SON CREDIT DE concernedAmount.amount
      const newCredit = ( connected?.credit - concernedAmount?.amount )
      // 
      await prismadb.profile.updateMany({
        where: { googleEmail: connected?.googleEmail },
        data: { credit: newCredit }
      })
      // ON COMPTE COMBIEN Y'A DE COLLECTE TOTALITY D'OUVERT
      const openCollectionCount = await prismadb.collectionList.count({
        where: {
          amount: concernedAmount?.amount,
          isGroupComplete: false,
          collectionType: ctype
        }
      })
      // ##
      // ############ ZÉRO COLLECTTE D'OUVERTE ##################################
      if(openCollectionCount === 0)
      {
        // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
        await prismadb.collectionList.create({
          data: {
            ownId: metrics?.noit, // noit = next own id totality
            amount: concernedAmount?.amount,
            collectionType: ctype
          }
        })
        //
        await prismadb.collection.create({
          data: {
            ownId: metrics?.noit,
            amount: concernedAmount?.amount,
            collectionType: ctype,
            groupStatus: 1, // le premier participant
            rank: 1,  // son rang surnbre de participants
            googleEmail: connected?.googleEmail,
            usercodepin: connected?.usercodepin,
            profileId: connected?.id
          }
        })
        // ON UPDATE LE NOIT DE +1
        if(metrics?.noit)
        {
          await prismadb.metric.updateMany({
            data: { noit: metrics?.noit + 1 }
          })
        }
      }
      // ########## FIN ZÉRO COLLECTE D'OUVERTE #################################


      // ############ UNE COLLECTE D'OUVERTE ####################################
      if(openCollectionCount === 1)
      {
        const concernedCollection = await prismadb.collectionList.findFirst({
          where: {
            amount: concernedAmount?.amount,
            collectionType: ctype,
            isGroupComplete: false
          }
        })
        // ON VERIFIE S'IL N'EST PAS DÉJA DEDANS
        const inCollectionCount = await prismadb.collection.count({
          where: {
            ownId: concernedCollection?.ownId, // important
            amount: concernedCollection?.amount,
            collectionType: ctype,
            googleEmail: connected?.googleEmail
          }
        })
        // IL N'EST PAS DÉJA DEDANS
        if(inCollectionCount < 1)
        { 
          // on suppose que le groupe doit être de 10 participant
          // on select les participants qui y figure déjà
          // PARTICIPANT RANK1
          const rank1 = await prismadb.collection.findFirst({
            where: {
              rank: 1,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient1Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank1?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator1Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank1?.googleEmail //
            }
          })
          // PARTICIPANT RANK2
          const rank2 = await prismadb.collection.findFirst({
            where: {
              rank: 2,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient2Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank2?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator2Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank2?.googleEmail //
            }
          })
          // PARTICIPANT RANK3
          const rank3 = await prismadb.collection.findFirst({
            where: {
              rank: 3,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient3Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank3?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator3Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank3?.googleEmail //
            }
          })
          // PARTICIPANT RANK4
          const rank4 = await prismadb.collection.findFirst({
            where: {
              rank: 4,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient4Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank4?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator4Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank4?.googleEmail //
            }
          })
          // PARTICIPANT RANK5
          const rank5 = await prismadb.collection.findFirst({
            where: {
              rank: 5,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient5Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank5?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator5Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank5?.googleEmail //
            }
          })
          // PARTICIPANT RANK6
          const rank6 = await prismadb.collection.findFirst({
            where: {
              rank: 6,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient6Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank6?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator6Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank6?.googleEmail //
            }
          })
          // PARTICIPANT RANK7
          const rank7 = await prismadb.collection.findFirst({
            where: {
              rank: 7,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient7Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank7?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator7Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank7?.googleEmail //
            }
          })
          // PARTICIPANT RANK8
          const rank8 = await prismadb.collection.findFirst({
            where: {
              rank: 8,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient8Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank8?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator8Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank8?.googleEmail //
            }
          })
          // PARTICIPANT RANK9
          const rank9 = await prismadb.collection.findFirst({
            where: {
              rank: 9,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: concernedCollection?.ownId
            }
          })
          //
          const recipient9Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank9?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator9Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank9?.googleEmail //
            }
          })
          // S'IL N'A PAS ETE DONATEUR OU RECIPIENT D'AUCUN DES PARTICIPANTS PRÉSENT DANS LA COLLECTE
          if(recipient1Count < 1 && recipient2Count < 1 && recipient3Count < 1 && recipient4Count < 1 && 
            recipient5Count < 1 && recipient6Count < 1 && recipient7Count < 1 && recipient8Count < 1 && 
            recipient9Count < 1 && donator1Count < 1 && donator2Count < 1 && donator3Count < 1 && 
            donator4Count < 1 && donator5Count < 1 && donator6Count < 1 && donator7Count < 1 && 
            donator8Count < 1 && donator9Count < 1
          )
          {
            if(rank1) // c'est au moins sûr que le rank1 exist, donc on l'utilise ici
            {
              await prismadb.collection.create({
                data: {
                  ownId: rank1?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: rank1?.groupStatus + 1, // 
                  rank: rank1?.groupStatus + 1,  // son rang sur nbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // on update le groupstatus 
              await prismadb.collection.updateMany({
                where: {
                  ownId: rank1?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType:ctype
                },
                data:{
                  groupStatus: rank1?.groupStatus + 1
                }
              })
              // on vérifie si groupstatus est maintenant egal a group
              if(rank1?.group === rank1?.groupStatus + 1)
              {
                // on met isgroupComplete === true dans collectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    amount: concernedCollection?.amount,
                    collectionType: concernedCollection?.collectionType,
                    ownId: concernedCollection?.ownId
                  },data:{
                    isGroupComplete: true
                  }
                })
                // on met isgroupComplete === true dans  collection
                await prismadb.collection.updateMany({
                  where: {
                    amount: concernedCollection?.amount,
                    collectionType: concernedCollection?.collectionType,
                    ownId: concernedCollection?.ownId
                  },data:{
                    isGroupComplete: true
                  }
                })
              }
            }
          } // S'IL A ETE DONATEUR OU RECIPIENT D'AU MOINS UN SEUL
          else{
            // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
            await prismadb.collectionList.create({
              data: {
                ownId: metrics?.noit, // noit = next own id totality
                amount: concernedAmount?.amount,
                collectionType: ctype
              }
            })
            //
            await prismadb.collection.create({
              data: {
                ownId: metrics?.noit,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                groupStatus: 1, // le premier participant
                rank: 1,  // son rang surnbre de participants
                googleEmail: connected?.googleEmail,
                usercodepin: connected?.usercodepin,
                profileId: connected?.id
              }
            })
            // ON UPDATE LE NOIT DE +1
            if(metrics?.noit)
            {
              await prismadb.metric.updateMany({
                data: { noit: metrics?.noit + 1 }
              })
            }
          }
        }// IL EST DÉJÀ DANS CETTE COLLECTE 
        else{
          // ON EN CRÉE UNE ET ON L'ENTRE COMME RANK = 1
          await prismadb.collectionList.create({
            data: {
              ownId: metrics?.noit, // noit = next own id totality
              amount: concernedAmount?.amount,
              collectionType: ctype
            }
          })
          //
          await prismadb.collection.create({
            data: {
              ownId: metrics?.noit,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              groupStatus: 1, // le premier participant
              rank: 1,  // son rang surnbre de participants
              googleEmail: connected?.googleEmail,
              usercodepin: connected?.usercodepin,
              profileId: connected?.id
            }
          })
          // ON UPDATE LE NOIT DE +1
          if(metrics?.noit)
          {
            await prismadb.metric.updateMany({
              data: { noit: metrics?.noit + 1 }
            })
          }
        }
      }
      // ######## FIN UNE COLLECTE D'OUVERTE #################################### 


      // ############ DEUX COLLECTEs D'OUVERTEs ####################################
      if(openCollectionCount === 2)
      {
        const topCollection = await prismadb.collectionList.findFirst({
          where: {
            amount: concernedAmount?.amount,
            collectionType: ctype,
            isGroupComplete: false
          },
          orderBy: { ownId: "asc"}
        })
        // ON VERIFIE S'IL N'EST PAS DÉJA DEDANS
        const inCollectionCount = await prismadb.collection.count({
          where: {
            ownId: topCollection?.ownId,
            amount: topCollection?.amount,
            collectionType: ctype,
            googleEmail: connected?.googleEmail
          }
        })
        // IL N'EST PAS DÉJA DANS LE TOP COLLECTION
        if(inCollectionCount < 1)
        {  
          // on suppose que le groupe doit être de 10 participant
          // on select les participants qui y figure déjà
          // PARTICIPANT RANK1
          const rank1 = await prismadb.collection.findFirst({
            where: {
              rank: 1,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
            })
          //
          const recipient1Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank1?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator1Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank1?.googleEmail //
            }
          })
          // PARTICIPANT RANK2
          const rank2 = await prismadb.collection.findFirst({
            where: {
              rank: 2,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient2Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank2?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator2Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank2?.googleEmail //
            }
          })
          // PARTICIPANT RANK3
          const rank3 = await prismadb.collection.findFirst({
            where: {
              rank: 3,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient3Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank3?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator3Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank3?.googleEmail //
            }
          })
          // PARTICIPANT RANK4
          const rank4 = await prismadb.collection.findFirst({
            where: {
              rank: 4,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient4Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank4?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator4Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank4?.googleEmail //
            }
          })
          // PARTICIPANT RANK5
          const rank5 = await prismadb.collection.findFirst({
            where: {
              rank: 5,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient5Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank5?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator5Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank5?.googleEmail //
            }
          })
          // PARTICIPANT RANK6
          const rank6 = await prismadb.collection.findFirst({
            where: {
              rank: 6,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient6Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank6?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator6Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank6?.googleEmail //
            }
          })
          // PARTICIPANT RANK7
          const rank7 = await prismadb.collection.findFirst({
            where: {
              rank: 7,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient7Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank7?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator7Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank7?.googleEmail //
            }
          })
          // PARTICIPANT RANK8
          const rank8 = await prismadb.collection.findFirst({
            where: {
              rank: 8,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient8Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank8?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator8Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank8?.googleEmail //
            }
          })
          // PARTICIPANT RANK9
          const rank9 = await prismadb.collection.findFirst({
            where: {
              rank: 9,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false, 
              ownId: topCollection?.ownId
            }
          })
          //
          const recipient9Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: rank9?.googleEmail,
              recipientEmail: connected?.googleEmail // connected est recipient ?
            }
          })
          const donator9Count = await prismadb.collectionResult.count({
            where: {
              donatorEmail: connected?.googleEmail, // connected est donator ?
              recipientEmail: rank9?.googleEmail //
            }
          })
          //
          // S'IL N'A PAS ETE DONATEUR OU RECIPIENT D'AUCUN DES PARTICIPANTS PRÉSENT DANS LA COLLECTE
          if(recipient1Count < 1 && recipient2Count < 1 && recipient3Count < 1 && recipient4Count < 1 && 
            recipient5Count < 1 && recipient6Count < 1 && recipient7Count < 1 && recipient8Count < 1 && 
            recipient9Count < 1 && donator1Count < 1 && donator2Count < 1 && donator3Count < 1 && 
            donator4Count < 1 && donator5Count < 1 && donator6Count < 1 && donator7Count < 1 && 
            donator8Count < 1 && donator9Count < 1
          )
          {
            if(rank1)
            {
              await prismadb.collection.create({
                data: {
                  ownId: rank1?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: rank1?.groupStatus + 1, // 
                  rank: rank1?.groupStatus + 1,  // son rang sur nbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // on update le groupstatus 
              await prismadb.collection.updateMany({
                where: {
                  ownId: rank1?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType:ctype
                },
                data:{
                  groupStatus: rank1?.groupStatus + 1
                }
              })
              // on vérifie si groupstatus est maintenant egal a group
              if(rank1?.group === rank1?.groupStatus + 1)
              {
                // on met isgroupComplete === true dans  collectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    amount: topCollection?.amount,
                    collectionType: ctype,
                    ownId: topCollection?.ownId
                  },data:{
                    isGroupComplete: true
                  }
                })
                // on met isgroupComplete === true dans  collection
                await prismadb.collection.updateMany({
                  where: {
                    amount: topCollection?.amount,
                    collectionType: ctype,
                    ownId: topCollection?.ownId
                  },data:{
                    isGroupComplete: true
                  }
                })
              }
            }  
          }// S'IL A ETE DONATEUR OU RECIPIENT D'AU MOINS UN SEUL
          else{
            // ON VA VERS LE BOTTOM
            const bottomCollection = await prismadb.collectionList.findFirst({
              where: {
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false
              },
              orderBy: { ownId: "desc"}
            })
            // ON VERIFIE S'IL N'EST PAS DÉJA DEDANS
            const inCollectionCount = await prismadb.collection.count({
              where: {
                amount: bottomCollection?.amount,
                collectionType: ctype,
                googleEmail: connected?.googleEmail
              }
            })
            // IL N'EST PAS DANS LE BOTTOM COLLECTION
            if(inCollectionCount < 1)
            {  
              // on suppose que le groupe doit être de 10 participant
              // on select les participants qui y figure déjà
              // PARTICIPANT RANK1
              const rank1 = await prismadb.collection.findFirst({
                where: {
                  rank: 1,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
                })
              //
              const recipient1Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank1?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator1Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank1?.googleEmail //
                }
              })
              // PARTICIPANT RANK2
              const rank2 = await prismadb.collection.findFirst({
                where: {
                  rank: 2,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient2Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank2?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator2Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank2?.googleEmail //
                }
              })
              // PARTICIPANT RANK3
              const rank3 = await prismadb.collection.findFirst({
                where: {
                  rank: 3,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient3Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank3?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator3Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank3?.googleEmail //
                }
              })
              // PARTICIPANT RANK4
              const rank4 = await prismadb.collection.findFirst({
                where: {
                  rank: 4,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient4Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank4?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator4Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank4?.googleEmail //
                }
              })
              // PARTICIPANT RANK5
              const rank5 = await prismadb.collection.findFirst({
                where: {
                  rank: 5,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient5Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank5?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator5Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank5?.googleEmail //
                }
              })
              // PARTICIPANT RANK6
              const rank6 = await prismadb.collection.findFirst({
                where: {
                  rank: 6,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient6Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank6?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator6Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank6?.googleEmail //
                }
              })
              // PARTICIPANT RANK7
              const rank7 = await prismadb.collection.findFirst({
                where: {
                  rank: 7,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient7Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank7?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator7Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank7?.googleEmail //
                }
              })
              // PARTICIPANT RANK8
              const rank8 = await prismadb.collection.findFirst({
                where: {
                  rank: 8,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient8Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank8?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator8Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank8?.googleEmail //
                }
              })
              // PARTICIPANT RANK9
              const rank9 = await prismadb.collection.findFirst({
                where: {
                  rank: 9,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  isGroupComplete: false, 
                  ownId: bottomCollection?.ownId
                }
              })
              //
              const recipient9Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: rank9?.googleEmail,
                  recipientEmail: connected?.googleEmail // connected est recipient ?
                }
              })
              const donator9Count = await prismadb.collectionResult.count({
                where: {
                  donatorEmail: connected?.googleEmail, // connected est donator ?
                  recipientEmail: rank9?.googleEmail //
                }
              })
              //
              // S'IL N'A PAS ETE DONATEUR OU RECIPIENT D'AUCUN DES PARTICIPANTS PRÉSENT DANS LA COLLECTE
              if(recipient1Count < 1 && recipient2Count < 1 && recipient3Count < 1 && recipient4Count < 1 && 
                recipient5Count < 1 && recipient6Count < 1 && recipient7Count < 1 && recipient8Count < 1 && 
                recipient9Count < 1 && donator1Count < 1 && donator2Count < 1 && donator3Count < 1 && 
                donator4Count < 1 && donator5Count < 1 && donator6Count < 1 && donator7Count < 1 && 
                donator8Count < 1 && donator9Count < 1
              )
              {
                if(rank1)
                {
                  await prismadb.collection.create({
                    data: {
                      ownId: rank1?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype,
                      groupStatus: rank1?.groupStatus + 1, // 
                      rank: rank1?.groupStatus + 1,  // son rang sur nbre de participants
                      googleEmail: connected?.googleEmail,
                      usercodepin: connected?.usercodepin,
                      profileId: connected?.id
                    }
                  })
                  // on update le groupstatus 
                  await prismadb.collection.updateMany({
                    where: {
                      ownId: rank1?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType:ctype
                    },
                    data:{
                      groupStatus: rank1?.groupStatus + 1
                    }
                  })
                  // on vérifie si groupstatus est maintenant egal a group
                  if(rank1?.group === rank1?.groupStatus + 1)
                  {
                    // on met isgroupComplete === true dans  collectionList
                    await prismadb.collectionList.updateMany({
                      where: {
                        amount: bottomCollection?.amount,
                        collectionType: ctype,
                        ownId: bottomCollection?.ownId
                      },data:{
                        isGroupComplete: true
                      }
                    })
                    // on met isGroupComplete === true dans  collection
                    await prismadb.collection.updateMany({
                      where: {
                        amount: bottomCollection?.amount,
                        collectionType: ctype,
                        ownId: bottomCollection?.ownId
                      },data:{
                        isGroupComplete: true
                      }
                    })
                  }
                }  
              }
              // S'IL A ETE DONATEUR OU RECIPIENT D'AU MOINS UN SEUL
              else{
                // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.noit, // noit = next own id totality
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.noit,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang surnbre de participants
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // ON UPDATE LE NOIT DE +1
                if(metrics?.noit)
                {
                  await prismadb.metric.updateMany({
                    data: { noit: metrics?.noit + 1 }
                  })
                }
              }
            } // IL EST DÉJÀ DANS LE BOTTOM COLLECTION
            else{
              // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
              await prismadb.collectionList.create({
                data: {
                  ownId: metrics?.noit, // noit = next own id totality
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                }
              })
              //
              await prismadb.collection.create({
                data: {
                  ownId: metrics?.noit,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 1, // le premier participant
                  rank: 1,  // son rang surnbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // ON UPDATE LE NOIT DE +1
              if(metrics?.noit)
              {
                await prismadb.metric.updateMany({
                  data: { noit: metrics?.noit + 1 }
                })
              }
            } 
          }
        }// S'IL EST DÉJA DANS LE TOP COLLECTION, ON VA VERS BOTTOMCOLLECTION
        else{
          const bottomCollection = await prismadb.collectionList.findFirst({
            where: {
              amount: concernedAmount?.amount,
              collectionType: ctype,
              isGroupComplete: false
            },
            orderBy: { ownId: "desc"}
          })
          // ON VERIFIE S'IL N'EST PAS DÉJA DEDANS
          const inCollectionCount = await prismadb.collection.count({
            where: {
              amount: bottomCollection?.amount,
              collectionType: ctype,
              googleEmail: connected?.googleEmail
            }
          })
          // IL N'EST PAS DANS LE BOTTOM COLLECTION
          if(inCollectionCount < 1)
          {  
            // on suppose que le groupe doit être de 10 participant
            // on select les participants qui y figure déjà
            // PARTICIPANT RANK1
            const rank1 = await prismadb.collection.findFirst({
              where: {
                rank: 1,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
              })
            //
            const recipient1Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank1?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator1Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank1?.googleEmail //
              }
            })
            // PARTICIPANT RANK2
            const rank2 = await prismadb.collection.findFirst({
              where: {
                rank: 2,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient2Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank2?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator2Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank2?.googleEmail //
              }
            })
            // PARTICIPANT RANK3
            const rank3 = await prismadb.collection.findFirst({
              where: {
                rank: 3,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient3Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank3?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator3Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank3?.googleEmail //
              }
            })
            // PARTICIPANT RANK4
            const rank4 = await prismadb.collection.findFirst({
              where: {
                rank: 4,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient4Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank4?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator4Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank4?.googleEmail //
              }
            })
            // PARTICIPANT RANK5
            const rank5 = await prismadb.collection.findFirst({
              where: {
                rank: 5,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient5Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank5?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator5Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank5?.googleEmail //
              }
            })
            // PARTICIPANT RANK6
            const rank6 = await prismadb.collection.findFirst({
              where: {
                rank: 6,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient6Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank6?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator6Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank6?.googleEmail //
              }
            })
            // PARTICIPANT RANK7
            const rank7 = await prismadb.collection.findFirst({
              where: {
                rank: 7,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient7Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank7?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator7Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank7?.googleEmail //
              }
            })
            // PARTICIPANT RANK8
            const rank8 = await prismadb.collection.findFirst({
              where: {
                rank: 8,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient8Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank8?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator8Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank8?.googleEmail //
              }
            })
            // PARTICIPANT RANK9
            const rank9 = await prismadb.collection.findFirst({
              where: {
                rank: 9,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                isGroupComplete: false, 
                ownId: bottomCollection?.ownId
              }
            })
            //
            const recipient9Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: rank9?.googleEmail,
                recipientEmail: connected?.googleEmail // connected est recipient ?
              }
            })
            const donator9Count = await prismadb.collectionResult.count({
              where: {
                donatorEmail: connected?.googleEmail, // connected est donator ?
                recipientEmail: rank9?.googleEmail //
              }
            })
            //
            // S'IL N'A PAS ETE DONATEUR OU RECIPIENT D'AUCUN DES PARTICIPANTS PRÉSENT DANS LA COLLECTE
            if(recipient1Count < 1 && recipient2Count < 1 && recipient3Count < 1 && recipient4Count < 1 && 
              recipient5Count < 1 && recipient6Count < 1 && recipient7Count < 1 && recipient8Count < 1 && 
              recipient9Count < 1 && donator1Count < 1 && donator2Count < 1 && donator3Count < 1 && 
              donator4Count < 1 && donator5Count < 1 && donator6Count < 1 && donator7Count < 1 && 
              donator8Count < 1 && donator9Count < 1
            )
            {
              if(rank1)
              {
                await prismadb.collection.create({
                  data: {
                    ownId: rank1?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: rank1?.groupStatus + 1, // 
                    rank: rank1?.groupStatus + 1,  // son rang sur nbre de participants
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // on update le groupstatus 
                await prismadb.collection.updateMany({
                  where: {
                    ownId: rank1?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType:ctype
                  },
                  data:{
                    groupStatus: rank1?.groupStatus + 1
                  }
                })
                // on vérifie si groupstatus est maintenant egal a group
                if(rank1?.group === rank1?.groupStatus + 1)
                {
                  // on met isgroupComplete === true dans  collectionList
                  await prismadb.collectionList.updateMany({
                    where: {
                      amount: bottomCollection?.amount,
                      collectionType: ctype,
                      ownId: bottomCollection?.ownId
                    },data:{
                      isGroupComplete: true
                    }
                  })
                  // on met isGroupComplete === true dans  collection
                  await prismadb.collection.updateMany({
                    where: {
                      amount: bottomCollection?.amount,
                      collectionType: ctype,
                      ownId: bottomCollection?.ownId
                    },data:{
                      isGroupComplete: true
                    }
                  })
                }
              }  
            }
            // S'IL A ETE DONATEUR OU RECIPIENT D'AU MOINS UN SEUL
            else{
              // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
              await prismadb.collectionList.create({
                data: {
                  ownId: metrics?.noit, // noit = next own id totality
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                }
              })
              //
              await prismadb.collection.create({
                data: {
                  ownId: metrics?.noit,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 1, // le premier participant
                  rank: 1,  // son rang surnbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // ON UPDATE LE NOIT DE +1
              if(metrics?.noit)
              {
                await prismadb.metric.updateMany({
                  data: { noit: metrics?.noit + 1 }
                })
              }
            }
          } // IL EST DÉJÀ DANS LE BOTTOM COLLECTION
          else{
            // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
            await prismadb.collectionList.create({
              data: {
                ownId: metrics?.noit, // noit = next own id totality
                amount: concernedAmount?.amount,
                collectionType: ctype
              }
            })
            //
            await prismadb.collection.create({
              data: {
                ownId: metrics?.noit,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                groupStatus: 1, // le premier participant
                rank: 1,  // son rang surnbre de participants
                googleEmail: connected?.googleEmail,
                usercodepin: connected?.usercodepin,
                profileId: connected?.id
              }
            })
            // ON UPDATE LE NOIT DE +1
            if(metrics?.noit)
            {
              await prismadb.metric.updateMany({
                data: { noit: metrics?.noit + 1 }
              })
            }
          } 
        }
      }
      // ######## FIN DEUX COLLECTES D'OUVERTE #################################### 

//###########
      // ############ PLUS DE DEUX COLLECTES D'OUVERTES ####################################
      if(openCollectionCount > 2)
      {
        //TODO: prochainement
      }// ######## FIN PLUS DE DEUX COLLECTES D'OUVERTES #################################### 
    }
    //
  revalidatePath('/dashboard');
  redirect('/dashboard')
}

function myDonators(value: { id: string; donatorcodepin: number; donatorEmail: string | null; collectionOwnId: number | null; amount: number | null; currency: string; collectionType: string; recipientcodepin: number; recipientEmail: string | null; donationReceived: number; createdAt: Date; }, index: number, array: { id: string; donatorcodepin: number; donatorEmail: string | null; collectionOwnId: number | null; amount: number | null; currency: string; collectionType: string; recipientcodepin: number; recipientEmail: string | null; donationReceived: number; createdAt: Date; }[]): unknown {
  throw new Error("Function not implemented.");
}
//
/*
// ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
            await prismadb.collectionList.create({
              data: {
                ownId: metrics?.noit, // noit = next own id totality
                amount: concernedAmount?.amount,
                collectionType: ctype
              }
            })
            //
            await prismadb.collection.create({
              data: {
                ownId: metrics?.noit,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                groupStatus: 1, // le premier participant
                rank: 1,  // son rang surnbre de participants
                googleEmail: connected?.googleEmail,
                usercodepin: connected?.usercodepin,
                profileId: connected?.id
              }
            })
            // ON UPDATE LE NOIT DE +1
            if(metrics?.noit)
            {
              await prismadb.metric.updateMany({
                data: { noit: metrics?.noit + 1 }
              })
            }
*/
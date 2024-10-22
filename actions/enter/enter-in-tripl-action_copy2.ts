"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// AMOUNT 1€ COLLECTION ENTER
export const enterInTriplAction = async (params:string) => {
  try 
  {
    // Le Montant concerné
    const concernedAmount = await prismadb.amount.findFirst({
      where: { id: params }
    })
    // Le next ownId
    const metrics = await prismadb.metric.findFirst() // en prod
    //
    const ctype = "tripl"
    // Le profile du connecté
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
      // ON COMPTE COMBIEN Y'A DE TRIPL D'OUVERT
      const openTriplCount = await prismadb.collectionList.count({
        where: {
          amount: concernedAmount?.amount,
          isGroupComplete: false,
          collectionType: ctype
        }
      })
      //
    //##
      // 2- S'IL Y A ZÉRO TRIPL D'OUVERT DE CE MONTANT
      if(openTriplCount === 0)
      {
        // ON EN CRÉE UN ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
        await prismadb.collectionList.create({
          data: {
            ownId: metrics?.nextOwnIdToEnter,
            amount: concernedAmount?.amount,
            collectionType: ctype
          }
        })
        //
        await prismadb.collection.create({
          data: {
            ownId: metrics?.nextOwnIdToEnter,
            amount: concernedAmount?.amount,
            collectionType: ctype,
            groupStatus: 1, // le premier participant
            rank: 1,  // son rang sur 1er, 2eme, 3eme participant
            googleEmail: connected?.googleEmail,
            usercodepin: connected?.usercodepin,
            profileId: connected?.id
          }
        })
        // ON UPDATE LE NEXTOWNID DE +1
        if(metrics?.nextOwnIdToEnter)
        {
          await prismadb.metric.updateMany({
            data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
          })
        }
      }
      //
    //##
      // 3- S'IL Y A 1 TRIPL D'OUVERT
      if( openTriplCount === 1 )
      {
        // on select le tripl en question
        const openTripl = await prismadb.collectionList.findFirst({
          where: {
            amount: concernedAmount?.amount,
            isGroupComplete: false,
            collectionType: ctype
          }
        })
        // on vérifie s'il n'est pas déjà dedans
        const inTriplCount = await prismadb.collection.count({
          where: {
            ownId: openTripl?.ownId,
            googleEmail: connected?.googleEmail,
            collectionType: ctype
          }
        })
        // IL N'EST PAS DANS CE TRIPL
        if(inTriplCount === 0)
        {
          // on select le nbre de participant dans le tripl
          const nbrOfParticipant = await prismadb.collection.findFirst({
            where: { 
              ownId: openTripl?.ownId,
              collectionType: ctype
            }
          })
          // ## IL Y A 1 PARTICIPANT, ON L'ENTRE COMME LE 2è ##
          if(nbrOfParticipant && nbrOfParticipant?.groupStatus === 1)
          {
            // on select le 1er participant
            const participantOne = await prismadb.collection.findFirst({
              where: { 
                ownId: openTripl?.ownId,
                collectionType: ctype,
                rank: 1
               }
            }) 
            // LE 1ER PARTICIPANT EST RECIPIENT DU CONNECTED ?
            const hasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: participantOne?.usercodepin,
                recipientEmail: participantOne?.googleEmail
              }
            })
            // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
            const hasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: participantOne?.usercodepin,
                donatorEmail: participantOne?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.email
              }
            })
            // S'IL N'A ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
            if(hasBeenRecipientCount === 0 && hasBeenDonatorCount === 0)
            {
              await prismadb.collection.create({
                data: {
                  ownId: openTripl?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 2, // le deuxième participant
                  rank: 2,  // son rang sur 1er, 2eme, 3eme participant
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // en update le groupStatus dans collection
              await prismadb.collection.updateMany({
                where: { 
                  ownId: openTripl?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: { 
                  groupStatus: 2
                }
              })
            } // S'IL A ÉTÉ RECIPIENT OU DONATOR DU CONNECTED
            else{
              // ON CRÉE UN NOUVEANT TRIPL ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
              await prismadb.collectionList.create({
                data: {
                  ownId: metrics?.nextOwnIdToEnter,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                }
              })
              //
              await prismadb.collection.create({
                data: {
                  ownId: metrics?.nextOwnIdToEnter,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 1, // le premier participant
                  rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // ON UPDATE LE NEXTOWNID DE +1
              if(metrics?.nextOwnIdToEnter)
              {
                await prismadb.metric.updateMany({
                  data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                })
              }
            }
          }// IL Y A 2 PARTICIPANTS, ON L'ENTRE COMME LE 3è 
          else{
              // on select le participant rank1
              const participantOne = await prismadb.collection.findFirst({
                where: { 
                  ownId: openTripl?.ownId,
                  collectionType: ctype,
                  rank: 1
                 }
              }) 
              // LE 1ER PARTICIPANT EST RECIPIENT DU CONNECTED ?
              const rank1HasBeenRecipientCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: connected?.usercodepin,
                  donatorEmail: connected?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: participantOne?.usercodepin,
                  recipientEmail: participantOne?.googleEmail
                }
              })
              // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
              const rank1hasBeenDonatorCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: participantOne?.usercodepin,
                  donatorEmail: participantOne?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: connected?.usercodepin,
                  recipientEmail: connected?.email
                }
              })
              // on selecte le participant rank2
              const participantTwo = await prismadb.collection.findFirst({
                where: { 
                  ownId: openTripl?.ownId,
                  collectionType: ctype,
                  rank: 2
                 }
              }) 
              // LE 2E PARTICIPANT EST RECIPIENT DU CONNECTED ?
              const rank2HasBeenRecipientCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: connected?.usercodepin,
                  donatorEmail: connected?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: participantTwo?.usercodepin,
                  recipientEmail: participantTwo?.googleEmail
                }
              })
              // LE 2E PARTICIPANT EST IL DONATOR DU CONNECTED ?
              const rank2HasBeenDonatorCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: participantTwo?.usercodepin,
                  donatorEmail: participantTwo?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: connected?.usercodepin,
                  recipientEmail: connected?.email
                }
              })
              //
              // LES 2 N'ONT ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
              if(rank1HasBeenRecipientCount === 0 && rank1hasBeenDonatorCount === 0 && rank2HasBeenRecipientCount === 0 && rank2HasBeenDonatorCount === 0 )
              {
                await prismadb.collection.create({
                  data: {
                    ownId: openTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 3, // le troisième participant
                    rank: 3,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // en update le collectionList
                await prismadb.collectionList.updateMany({
                  where: { 
                    ownId: openTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype 
                  },
                  data: {
                    isGroupComplete: true,
                  }
                })
                // en update le groupStatus dans collection
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: openTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: { 
                    isGroupComplete: true,
                    groupStatus: 3
                  }
                })
              } // S'ILS ONT ÉTÉ RECIPIENT OU DONATOR DU CONNECTED
              else{
                // ON CRÉE UN NOUVEANT TRIPL ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // ON UPDATE LE NEXTOWNID DE +1
                if(metrics?.nextOwnIdToEnter)
                {
                  await prismadb.metric.updateMany({
                    data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                  })
                }
              }
            }
        } // S'IL EST DANS LE TRIPL OUVERT
        else{
          // ON EN CRÉE UN ET ON L'Y ENTRE COMME 1ER PARTICIPANT
          await prismadb.collectionList.create({
            data: {
              ownId: metrics?.nextOwnIdToEnter,
              amount: concernedAmount?.amount,
              collectionType: ctype
            }
          })
          //
          await prismadb.collection.create({
            data: {
              ownId: metrics?.nextOwnIdToEnter,
              amount: concernedAmount?.amount,
              collectionType: ctype,
              groupStatus: 1, // le premier participant
              rank: 1,  // son rang sur 1er, 2eme, 3eme participant
              googleEmail: connected?.googleEmail,
              usercodepin: connected?.usercodepin,
              profileId: connected?.id
            }
          })
          // ON UPDATE LE NEXTOWNID DE +1
          if(metrics?.nextOwnIdToEnter)
          {
            await prismadb.metric.updateMany({
              data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
            })
          }
        }
      }    
      //
    //## 4- S'IL Y A 2 TRIPL D'OUVERT ###############################
      if( openTriplCount === 2 )
      {
        // on select le tripl du haut
        const topTripl = await prismadb.collectionList.findFirst({
          take: 1,
          where: {
            amount: concernedAmount?.amount,
            isGroupComplete: false,
            collectionType: ctype
          },
          orderBy: { ownId: "asc"}
        })
        // on vérifie s'il n'est pas déjà dedans
        const inTopTriplCount = await prismadb.collection.count({
          where: {
            ownId: topTripl?.ownId,
            googleEmail: connected?.googleEmail,
            collectionType: ctype
          }
        })
        // ### IL N'EST PAS DANS LE TRIPL DU HAUT ###
        if(inTopTriplCount === 0)
        {
          // on select le nbre de participant dans le tripl
          const theparticipant = await prismadb.collection.findFirst({
            take: 1,
            where: { 
              ownId: topTripl?.ownId,
              collectionType: ctype
            }
          })
          // ## S'IL Y A DEJA 1 PARTICIPANT
          if( theparticipant && theparticipant?.groupStatus === 1)
          {
            // LE 1ER PARTICIPANT EST IL RECIPIENT DU CONNECTED ?
            const hasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: theparticipant?.usercodepin,
                recipientEmail: theparticipant?.googleEmail
              }
            })
            // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
            const hasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: theparticipant?.usercodepin,
                donatorEmail: theparticipant?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.googleEmail
              }
            })
            // S'IL N'A ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
            if(hasBeenRecipientCount === 0 && hasBeenDonatorCount === 0)
            {
              // on l'ajoute dan sle tripl
              await prismadb.collection.create({
                data: {
                  ownId: topTripl?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 2, // le deuxième participant
                  rank: 2,  // son rang sur 1er, 2eme, 3eme participant
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // en update le groupStatus dans collection
              await prismadb.collection.updateMany({
                where: { 
                  ownId: topTripl?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: { 
                  groupStatus: 2
                }
              })
            }
            // #################################################################
            // ## S'IL A ETE RECIPIENT OU DONACTOR ### 
            // ## ON SELECT LE TRIPL DU BAS ##
            else{
              const bottomTripl = await prismadb.collectionList.findFirst({
                take: 1,
                where: {
                  amount: concernedAmount?.amount,
                  isGroupComplete: false,
                  collectionType: ctype
                },
                orderBy: { ownId: "desc"}
              })
              // on vérifie s'il n'est pas déjà dedans
              const inBottomTriplCount = await prismadb.collection.count({
                where: {
                  ownId: bottomTripl?.ownId,
                  googleEmail: connected?.googleEmail,
                  collectionType: ctype
                }
              })
              // IL N'EST PAS DANS LE TRIPL DU BAS
              if(inBottomTriplCount === 0)
              {
                // on select le nbre de participant dans le tripl
                const theParticipant = await prismadb.collection.findFirst({
                  take:1,
                  where: { 
                    ownId: bottomTripl?.ownId,
                    collectionType: ctype
                  }
                })
                // ## S'IL Y A 1 PARTICIPANT DANS LE TRIPL DU BAS ##
                if( theParticipant && theParticipant?.groupStatus === 1)
                {
                  // LE 1ER PARTICIPANT EST IL RECIPIENT DU CONNECTED ?
                  const hasBeenRecipientCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: connected?.usercodepin,
                      donatorEmail: connected?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: theParticipant?.usercodepin,
                      recipientEmail: theParticipant?.googleEmail
                    }
                  })  
                  // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
                  const hasBeenDonatorCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: theParticipant?.usercodepin,
                      donatorEmail: theParticipant?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: connected?.usercodepin,
                      recipientEmail: connected?.googleEmail
                    }
                  })
                  // S'IL N'A ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
                  if(hasBeenRecipientCount === 0 && hasBeenDonatorCount === 0)
                  {
                    // on l'entre dans le tripl comme 2é participant
                    await prismadb.collection.create({
                      data: {
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 2, // le deuxième participant
                        rank: 2,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // en update le groupStatus dans collection
                    await prismadb.collection.updateMany({
                      where: { 
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype
                      },
                      data: { 
                        groupStatus: 2
                      }
                    })
                  }
                  // ###################################### 
                  // S'IL A ÉTÉ SOIT DONATOR SOIT RECIPIENT
                  else{
                    // ON CREE UN NOUVEAU ON L'Y ENTREE
                    await prismadb.collectionList.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype
                      }
                    })
                    //
                    await prismadb.collection.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 1, // le premier participant
                        rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // ON UPDATE LE NEXTOWNID DE +1
                    if(metrics?.nextOwnIdToEnter)
                    {
                      await prismadb.metric.updateMany({
                        data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                      })
                    }
                  }  
                }// ## S'IL Y A 2 PARTICIPANTS DANS LE TRIPL DU BAS ## 
                else{
                  // on select le participant rank1
                  const participantOne = await prismadb.collection.findFirst({
                    where: { 
                      ownId: bottomTripl?.ownId,
                      collectionType: ctype,
                      rank: 1
                    }
                  }) 
                  // LE 1ER A T-IL DÉJÀ ÉTÉ RECIPIENT DU CONNECTED ?
                  const rank1HasBeenRecipientCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: connected?.usercodepin,
                      donatorEmail: connected?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: participantOne?.usercodepin,
                      recipientEmail: participantOne?.googleEmail
                    }
                  })
                  // LE 1ER A T-IL DÉJÀ ÉTÉ DONATOR DU CONNECTED ?
                  const rank1hasBeenDonatorCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: participantOne?.usercodepin,
                      donatorEmail: participantOne?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: connected?.usercodepin,
                      recipientEmail: connected?.googleEmail
                    }
                  })
                  // on select le participant rank2
                  const participantTwo = await prismadb.collection.findFirst({
                    where: { 
                      ownId: bottomTripl?.ownId,
                      collectionType: ctype,
                      rank: 2
                    }
                  }) 
                  // LE 2E A T-IL DÉJÀ ÉTÉ RECIPIENT DU CONNECTED ?
                  const rank2HasBeenRecipientCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: connected?.usercodepin,
                      donatorEmail: connected?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: participantTwo?.usercodepin,
                      recipientEmail: participantTwo?.googleEmail
                    }
                  })
                  // LE 2E A T-IL DÉJÀ ÉTÉ DONATOR DU CONNECTED ?
                  const rank2HasBeenDonatorCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: participantTwo?.usercodepin,
                      donatorEmail: participantTwo?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: connected?.usercodepin,
                      recipientEmail: connected?.googleEmail
                    }
                  })
                  // LES 2 N'ONT ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
                  if(rank1HasBeenRecipientCount === 0 && rank1hasBeenDonatorCount === 0 && rank2HasBeenRecipientCount === 0 && rank2HasBeenDonatorCount )
                  { 
                    //on l'entre comme le 3è participant
                    await prismadb.collection.create({
                      data: {
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 3, // le troisième participant
                        rank: 3,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // en update le collectionList
                    await prismadb.collectionList.updateMany({
                      where: { 
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount ,
                        collectionType: ctype,
                      },
                      data: {
                        isGroupComplete: true,
                      }
                    })
                    // en update le groupStatus dans collection
                    await prismadb.collection.updateMany({
                      where: { 
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                      },
                      data: { 
                        isGroupComplete: true,
                        groupStatus: 3
                      }
                    })
                  } 
                  // ###
                  // LES 2 ONT ÉTÉ SOIT RECIPIENT SOIT DONATOR DU CONNECTED
                  else{
                    // ON CRÉE UN NOUVEAU TRIPL ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
                    await prismadb.collectionList.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                      }
                    })
                    //
                    await prismadb.collection.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 1, // le premier participant
                        rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // ON UPDATE LE NEXTOWNID DE +1
                    if(metrics?.nextOwnIdToEnter)
                    {
                      await prismadb.metric.updateMany({
                        data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                      })
                    }
                  }
                }
              }
              // ### 
              // S'IL EST DANS LE TRIPL DU BAS
              else{
                // ON CREE UN NOUVEAU ON L'Y ENTREE
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // ON UPDATE LE NEXTOWNID DE +1
                if(metrics?.nextOwnIdToEnter)
                {
                  await prismadb.metric.updateMany({
                    data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                  })
                }
              }
            } // tripl du bas
          }
          // ## S'IL Y A DÉJA 2 PARTICIPANTS
          else{
            // on select le participant rank1
            const participantOne = await prismadb.collection.findFirst({
              where: { 
                ownId: topTripl?.ownId,
                collectionType: ctype,
                rank: 1
              }
            }) 
            // LE 1ER PARTICIPANT EST RECIPIENT DU CONNECTED ?
            const rank1HasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: participantOne?.usercodepin,
                recipientEmail: participantOne?.googleEmail
              }
            })
            // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
            const rank1hasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: participantOne?.usercodepin,
                donatorEmail: participantOne?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.googleEmail
              }
            })
            // on selecte le participant rank2
            const participantTwo = await prismadb.collection.findFirst({
              where: { 
                ownId: topTripl?.ownId,
                collectionType: ctype,
                rank: 2
              }
            }) 
            // LE 2E PARTICIPANT EST RECIPIENT DU CONNECTED ?
            const rank2HasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: participantTwo?.usercodepin,
                recipientEmail: participantTwo?.googleEmail
              }
            })
            // LE 2E PARTICIPANT EST IL DONATOR DU CONNECTED ?
            const rank2HasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: participantTwo?.usercodepin,
                donatorEmail: participantTwo?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.googleEmail
              }
            })
            // LES 2 N'ONT ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
            if(rank1HasBeenRecipientCount === 0 && rank1hasBeenDonatorCount === 0 && rank2HasBeenRecipientCount === 0 && rank2HasBeenDonatorCount )
            {
              // on l'entre comme le 3è 
              await prismadb.collection.create({
                data: {
                  ownId: topTripl?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 3, // le troisième participant
                  rank: 3,  // son rang sur 1er, 2eme, 3eme participant
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // en update le collectionList
              await prismadb.collectionList.updateMany({
                where: { 
                  ownId: topTripl?.ownId,
                  amount: concernedAmount?.amount ,
                  collectionType: ctype,
                },
                data: {
                  isGroupComplete: true,
                }
              })
              // en update le groupStatus dans collection
              await prismadb.collection.updateMany({
                where: { 
                  ownId: topTripl?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                },
                data: { 
                  isGroupComplete: true,
                  groupStatus: 3
                }
              })
            } // S'ILS ONT ÉTÉ RECIPIENT OU DONATOR DU CONNECTED
            else{
              // ON SELECT LE TRIPL DU BAS
              const bottomTripl = await prismadb.collectionList.findFirst({
                take: 1,
                where: {
                  amount: concernedAmount?.amount,
                  isGroupComplete: false,
                  collectionType: ctype,
                },
                orderBy: { ownId: "desc"}
              })
              // on vérifie s'il n'est pas déjà dedans
              const inBottomTriplCount = await prismadb.collection.count({
                where: {
                  ownId: bottomTripl?.ownId,
                  googleEmail: connected?.googleEmail,
                  collectionType: ctype,
                }
              })
              // IL N'EST PAS DANS LE TRIPL DU BAS
              if(inBottomTriplCount === 0)
              {
                // on select le nbre de participant dans le tripl
                const btparticipantOne = await prismadb.collection.findFirst({
                  take:1,
                  where: { 
                    ownId: bottomTripl?.ownId,
                    collectionType: ctype,
                  }
                })
                // ## IL Y A 1 PARTICIPANT, ON L'ENTRE COMME LE 2è ##
                if( btparticipantOne && btparticipantOne?.groupStatus === 1)
                {
                  // LE 1ER PARTICIPANT EST IL RECIPIENT DU CONNECTED ?
                  const hasBeenRecipientCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: connected?.usercodepin,
                      donatorEmail: connected?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: btparticipantOne?.usercodepin,
                      recipientEmail: btparticipantOne?.googleEmail
                    }
                  })  
                  // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
                  const hasBeenDonatorCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: btparticipantOne?.usercodepin,
                      donatorEmail: btparticipantOne?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: connected?.usercodepin,
                      recipientEmail: connected?.googleEmail
                    }
                  })
                  // S'IL N'A ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
                  if(hasBeenRecipientCount === 0 && hasBeenDonatorCount === 0)
                  {
                    // on l'entre comme le 2è participant
                    await prismadb.collection.create({
                      data: {
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 2, // le deuxième participant
                        rank: 2,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // en update le groupStatus dans collection
                    await prismadb.collection.updateMany({
                      where: { 
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                      },
                      data: { 
                        groupStatus: 2
                      }
                    })
                  } // S'IL A ÉTÉ SOIT DONATOR SOIT RECIPIENT
                  else{
                    // ON CREE UN NOUVEAU ON L'Y ENTREE
                    await prismadb.collectionList.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                      }
                    })
                    //
                    await prismadb.collection.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 1, // le premier participant
                        rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // ON UPDATE LE NEXTOWNID DE +1
                    if(metrics?.nextOwnIdToEnter)
                    {
                      await prismadb.metric.updateMany({
                        data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                      })
                    }
                  }  
                }// IL Y A 2 PARTICIPANTS, ON L'ENTRE COMME LE 3è 
                else{
                  // on select le participant rank1
                  const participantOne = await prismadb.collection.findFirst({
                    where: { 
                      ownId: bottomTripl?.ownId,
                      collectionType: ctype,
                      rank: 1
                    }
                  }) 
                  // LE 1ER PARTICIPANT EST RECIPIENT DU CONNECTED ?
                  const rank1HasBeenRecipientCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: connected?.usercodepin,
                      donatorEmail: connected?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: participantOne?.usercodepin,
                      recipientEmail: participantOne?.googleEmail
                    }
                  })
                  // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
                  const rank1hasBeenDonatorCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: participantOne?.usercodepin,
                      donatorEmail: participantOne?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: connected?.usercodepin,
                      recipientEmail: connected?.googleEmail
                    }
                  })
                  // on selecte le participant rank2
                  const participantTwo = await prismadb.collection.findFirst({
                    where: { 
                      ownId: bottomTripl?.ownId,
                      collectionType: ctype,
                      rank: 2
                    }
                  }) 
                  // LE 2E PARTICIPANT EST RECIPIENT DU CONNECTED ?
                  const rank2HasBeenRecipientCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: connected?.usercodepin,
                      donatorEmail: connected?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: participantTwo?.usercodepin,
                      recipientEmail: participantTwo?.googleEmail
                    }
                  })
                  // LE 2E PARTICIPANT EST IL DONATOR DU CONNECTED ?
                  const rank2HasBeenDonatorCount = await prismadb.collectionResult.count({
                    where: { 
                      donatorcodepin: participantTwo?.usercodepin,
                      donatorEmail: participantTwo?.googleEmail,
                      collectionType: ctype,
                      //
                      recipientcodepin: connected?.usercodepin,
                      recipientEmail: connected?.googleEmail
                    }
                  })
                  // LES 2 N'ONT ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
                  if(rank1HasBeenRecipientCount === 0 && rank1hasBeenDonatorCount === 0 && rank2HasBeenRecipientCount === 0 && rank2HasBeenDonatorCount )
                  {
                     // on l'entre comme le 3è participant
                    await prismadb.collection.create({
                      data: {
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 3, // le troisième participant
                        rank: 3,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // en update le collectionList
                    await prismadb.collectionList.updateMany({
                      where: { 
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount ,
                        collectionType: ctype,
                      },
                      data: {
                        isGroupComplete: true,
                      }
                    })
                    // en update le groupStatus dans collection
                    await prismadb.collection.updateMany({
                      where: { 
                        ownId: bottomTripl?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                      },
                      data: { 
                        isGroupComplete: true,
                        groupStatus: 3
                      }
                    })
                  } // S'ILS ONT ÉTÉ RECIPIENT OU DONATOR DU CONNECTED
                  else{
                    // ON CRÉE UN NOUVEAU TRIPL ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
                    await prismadb.collectionList.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                      }
                    })
                    //
                    await prismadb.collection.create({
                      data: {
                        ownId: metrics?.nextOwnIdToEnter,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: 1, // le premier participant
                        rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // ON UPDATE LE NEXTOWNID DE +1
                    if(metrics?.nextOwnIdToEnter)
                    {
                      await prismadb.metric.updateMany({
                        data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                      })
                    }
                  }
                }
              } // S'IL EST DANS LE TRIPL DU BAS
              else{
                // ON CREE UN NOUVEAU ON L'Y ENTREE
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // ON UPDATE LE NEXTOWNID DE +1
                if(metrics?.nextOwnIdToEnter)
                {
                  await prismadb.metric.updateMany({
                    data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                  })
                }
              }
            }
          }
        }//# S'IL EST DANS LE TRIPL DU HAUT ## ON SELECT LE TRIPL DU BAS #####
        // ###################################################################  
        else{
          const bottomTripl = await prismadb.collectionList.findFirst({
            take: 1,
            where: {
              amount: concernedAmount?.amount,
              isGroupComplete: false,
              collectionType: ctype,
            },
            orderBy: { ownId: "desc"}
          })
          // on vérifie s'il n'est pas déjà dedans
          const inBottomTriplCount = await prismadb.collection.count({
            where: {
              ownId: bottomTripl?.ownId,
              googleEmail: connected?.googleEmail,
              collectionType: ctype,
            }
          })
          // IL N'EST PAS DANS LE TRIPL DU BAS
          if(inBottomTriplCount === 0)
          {
            // on select le nbre de participant dans le tripl
            const participantOne = await prismadb.collection.findFirst({
              take: 1,
              where: { 
                ownId: bottomTripl?.ownId,
                collectionType: ctype,
              }
            })
            // ## IL Y A 1 PARTICIPANT, ON L'ENTRE COMME LE 2è ##
            if(participantOne && participantOne?.groupStatus === 1)
            {
              // LE 1ER PARTICIPANT EST IL RECIPIENT DU CONNECTED ?
              const hasBeenRecipientCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: connected?.usercodepin,
                  donatorEmail: connected?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: participantOne?.usercodepin,
                  recipientEmail: participantOne?.googleEmail
                }
              })  
              // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
              const hasBeenDonatorCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: participantOne?.usercodepin,
                  donatorEmail: participantOne?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: connected?.usercodepin,
                  recipientEmail: connected?.googleEmail
                }
              })
              // S'IL N'A ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
              if(hasBeenRecipientCount === 0 && hasBeenDonatorCount === 0)
              {
                await prismadb.collection.create({
                  data: {
                    ownId: bottomTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 2, // le deuxième participant
                    rank: 2,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // en update le groupStatus dans collection
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: bottomTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    groupStatus: 2
                  }
                })
              } // S'IL A ÉTÉ SOIT DONATOR SOIT RECIPIENT
              else{
                // ON CREE UN NOUVEAU ON L'Y ENTREE
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // ON UPDATE LE NEXTOWNID DE +1
                if(metrics?.nextOwnIdToEnter)
                {
                  await prismadb.metric.updateMany({
                    data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                  })
                }
              }  
            }// IL Y A 2 PARTICIPANTS, ON L'ENTRE COMME LE 3è 
            else{
              // on select le participant rank1
              const participantOne = await prismadb.collection.findFirst({
                where: { 
                  ownId: bottomTripl?.ownId,
                  collectionType: ctype,
                  rank: 1
                }
              }) 
              // LE 1ER PARTICIPANT EST RECIPIENT DU CONNECTED ?
              const rank1HasBeenRecipientCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: connected?.usercodepin,
                  donatorEmail: connected?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: participantOne?.usercodepin,
                  recipientEmail: participantOne?.googleEmail
                }
              })
              // LE 1ER PARTICIPANT EST IL DONATOR DU CONNECTED ?
              const rank1hasBeenDonatorCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: participantOne?.usercodepin,
                  donatorEmail: participantOne?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: connected?.usercodepin,
                  recipientEmail: connected?.googleEmail
                }
              })
              // on selecte le participant rank2
              const participantTwo = await prismadb.collection.findFirst({
                where: { 
                  ownId: bottomTripl?.ownId,
                  collectionType: ctype,
                  rank: 2
                }
              }) 
              // LE 2E PARTICIPANT EST RECIPIENT DU CONNECTED ?
              const rank2HasBeenRecipientCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: connected?.usercodepin,
                  donatorEmail: connected?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: participantTwo?.usercodepin,
                  recipientEmail: participantTwo?.googleEmail
                }
              })
              // LE 2E PARTICIPANT EST IL DONATOR DU CONNECTED ?
              const rank2HasBeenDonatorCount = await prismadb.collectionResult.count({
                where: { 
                  donatorcodepin: participantTwo?.usercodepin,
                  donatorEmail: participantTwo?.googleEmail,
                  collectionType: ctype,
                  //
                  recipientcodepin: connected?.usercodepin,
                  recipientEmail: connected?.googleEmail
                }
              })
              // LES 2 N'ONT ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
              if(rank1HasBeenRecipientCount === 0 && rank1hasBeenDonatorCount === 0 && rank2HasBeenRecipientCount === 0 && rank2HasBeenDonatorCount )
              {
                await prismadb.collection.create({
                  data: {
                    ownId: bottomTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 3, // le troisième participant
                    rank: 3,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // en update le collectionList
                await prismadb.collectionList.updateMany({
                  where: { 
                    ownId: bottomTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: {
                    isGroupComplete: true,
                  }
                })
                // en update le groupStatus dans collection
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: bottomTripl?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    isGroupComplete: true,
                    groupStatus: 3
                  }
                })
              } // S'ILS ONT ÉTÉ RECIPIENT OU DONATOR DU CONNECTED
              else{
                // ON CRÉE UN NOUVEAU TRIPL ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.nextOwnIdToEnter,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // ON UPDATE LE NEXTOWNID DE +1
                if(metrics?.nextOwnIdToEnter)
                {
                  await prismadb.metric.updateMany({
                    data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                  })
                }
              }
            }
          } // S'IL EST DANS LE TRIPL DU BAS
          else{
            // ON CREE UN NOUVEAU ON L'Y ENTREE
            await prismadb.collectionList.create({
              data: {
                ownId: metrics?.nextOwnIdToEnter,
                amount: concernedAmount?.amount,
                collectionType: ctype,
              }
            })
            //
            await prismadb.collection.create({
              data: {
                ownId: metrics?.nextOwnIdToEnter,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                groupStatus: 1, // le premier participant
                rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                googleEmail: connected?.googleEmail,
                usercodepin: connected?.usercodepin,
                profileId: connected?.id
              }
            })
            // ON UPDATE LE NEXTOWNID DE +1
            if(metrics?.nextOwnIdToEnter)
            {
              await prismadb.metric.updateMany({
                data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
              })
            }
          }
        }
        // fin
      }
      //
      // 
    //## 5- S'IL Y A PLUS DE 2 TRIPL D'OUVERT ########################
    /* on l'entre dans le 1er tripl en partant du haut si les participants
    qui y sont n'ont pas été ces recipients ou donators. s'ils l'ont été,
    on choisi le tripl qui suit celui du haut et on l'y entre si les participant,
    qui y sont n'ont pas été ces recipients ou donators. s'ils l'ont été,
    on crée un autre tripl et on l'y entre. (pour ne pa se complique je 
    vais prendre ce racourcie, normalement je devrais essayé de l'entrer
    dans les autres tripl) */
      if( openTriplCount > 2 )
      { 
        // ON SELECT LE PREMIER TRIPL DANS L'ORDRE CROISSANT 
        const theOne = await prismadb.collection.findFirst({
          take: 1,
          where: {
            amount: concernedAmount?.amount,
            isGroupComplete: false,
            collectionType: ctype,
          },
          orderBy: { ownId: "asc"}
        })
        // on vérifie s'il n'est pas déjà dedans
        const inTheOneCount = await prismadb.collection.count({
          where: {
            ownId: theOne?.ownId,
            googleEmail: connected?.googleEmail,
            collectionType: ctype,
          }
        })
        // IL N'EST PAS DANS CE TRIPL
        if(inTheOneCount === 0)
        {
          // ## IL Y A 1 PARTICIPANT OU 2
          if(theOne?.groupStatus === 1 || theOne?.groupStatus === 2)
          {
            // on select le 1er participant
            const participantOne = await prismadb.collection.findFirst({
              where: { 
                ownId: theOne?.ownId,
                collectionType: ctype,
                rank: 1
              }
            }) 
            // LE 1ER EST-IL RECIPIENT DU CONNECTED ?
            const rank1HasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: participantOne?.usercodepin,
                recipientEmail: participantOne?.googleEmail
              }
            })
            // LE 1ER EST-IL DONATOR DU CONNECTED ?
            const rank1HasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: participantOne?.usercodepin,
                donatorEmail: participantOne?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.googleEmail
              }
            })
            // s'il y a déjà 2 participants ##  on selecte le participant rank2
            const participantTwo = await prismadb.collection.findFirst({
              where: { 
                ownId: theOne?.ownId,
                collectionType: ctype,
                rank: 2
              }
            }) 
            // LE 2E EST-IL RECIPIENT DU CONNECTED ?
            const rank2HasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: participantTwo?.usercodepin,
                recipientEmail: participantTwo?.googleEmail
              }
            })
            // LE 2E PARTICIPANT EST IL DONATOR DU CONNECTED ?
            const rank2HasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: participantTwo?.usercodepin,
                donatorEmail: participantTwo?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.googleEmail
              }
            })
            // S'IL N'A ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
            if(rank1HasBeenDonatorCount === 0 && rank1HasBeenRecipientCount === 0 || rank2HasBeenDonatorCount === 0 && rank2HasBeenRecipientCount === 0)
            {
              if(theOne?.groupStatus === 1)
              {  
                await prismadb.collection.create({
                  data: {
                    ownId: theOne?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 2, // le deuxième participant
                    rank: 2,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // en update le groupStatus dans collection
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: theOne?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    groupStatus: 2
                  }
                })
              }
  // LE CAS OÙ IL Y AURAIT DÉJÀ 2 PARTICIPANTS
              if(theOne?.groupStatus === 2)
              {  
                await prismadb.collection.create({
                  data: {
                    ownId: theOne?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 3, // le deuxième participant
                    rank: 3,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // en update le groupStatus dans collection
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: theOne?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    groupStatus: 3
                  }
                })
                // en update collectionList
                await prismadb.collectionList.updateMany({
                  where: { 
                    ownId: theOne?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    isGroupComplete: true
                  }
                })
              }
            } // S'IL A ÉTÉ RECIPIENT OU DONATOR DU CONNECTED
            else{
              // ON CRÉE UN NOUVEANT TRIPL ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
              await prismadb.collectionList.create({
                data: {
                  ownId: metrics?.nextOwnIdToEnter,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                }
              })
              //
              await prismadb.collection.create({
                data: {
                  ownId: metrics?.nextOwnIdToEnter,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 1, // le premier participant
                  rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // ON UPDATE LE NEXTOWNID DE +1
              if(metrics?.nextOwnIdToEnter)
                {
                  await prismadb.metric.updateMany({
                    data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                  })
                }
              }
          }
        }
        // ######################## TODO: SAMEDI SOIR 21/09/24
        else{
          // ON SELECT LE TRIPL SUIVANT CELUI DU HAUT
          const theNext = await prismadb.collection.findFirst({
            take:1,
            where: {
              ownId: { not: theOne?.ownId },
              amount: concernedAmount?.amount,
              isGroupComplete: false,
              collectionType: ctype,
            },
            orderBy: { ownId: "asc"}
          })
          // on vérifie s'il n'est pas déjà dedans
          const inTheNextCount = await prismadb.collection.count({
            where: {
              ownId: theNext?.ownId,
              googleEmail: connected?.googleEmail,
              collectionType: ctype,
            }
          })
          // IL N'EST PAS DANS CE TRIPL
          if(inTheNextCount === 0)
          {
            // ## IL Y A 1 PARTICIPANT OU 2
            if(theNext?.groupStatus === 1 || theNext?.groupStatus === 2)
          {
            // on select le 1er participant
            const participantOne = await prismadb.collection.findFirst({
              where: { 
                ownId: theNext?.ownId,
                collectionType: ctype,
                rank: 1
              }
            }) 
            // LE 1ER EST-IL RECIPIENT DU CONNECTED ?
            const rank1HasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: participantOne?.usercodepin,
                recipientEmail: participantOne?.googleEmail
              }
            })
            // LE 1ER EST-IL DONATOR DU CONNECTED ?
            const rank1HasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: participantOne?.usercodepin,
                donatorEmail: participantOne?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.googleEmail
              }
            })
            // s'il y a déjà 2 participants ##  on selecte le participant rank2
            const participantTwo = await prismadb.collection.findFirst({
              where: { 
                ownId: theNext?.ownId,
                collectionType: ctype,
                rank: 2
              }
            }) 
            // LE 2E EST-IL RECIPIENT DU CONNECTED ?
            const rank2HasBeenRecipientCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: connected?.usercodepin,
                donatorEmail: connected?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: participantTwo?.usercodepin,
                recipientEmail: participantTwo?.googleEmail
              }
            })
            // LE 2E PARTICIPANT EST IL DONATOR DU CONNECTED ?
            const rank2HasBeenDonatorCount = await prismadb.collectionResult.count({
              where: { 
                donatorcodepin: participantTwo?.usercodepin,
                donatorEmail: participantTwo?.googleEmail,
                collectionType: ctype,
                //
                recipientcodepin: connected?.usercodepin,
                recipientEmail: connected?.googleEmail
              }
            })
            // S'IL N'A ÉTÉ NI RECIPIENT NI DONATOR DU CONNECTED
            if(rank1HasBeenDonatorCount === 0 && rank1HasBeenRecipientCount === 0 || rank2HasBeenDonatorCount === 0 && rank2HasBeenRecipientCount === 0)
            {
              if(theNext?.groupStatus === 1)
              {  
                await prismadb.collection.create({
                  data: {
                    ownId: theNext?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 2, // le deuxième participant
                    rank: 2,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // en update le groupStatus dans collection
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: theNext?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    groupStatus: 2
                  }
                })
              }
              // LE CAS OÙ IL Y AURAIT DÉJÀ 2 PARTICIPANTS
              if(theNext?.groupStatus === 2)
              {  
                await prismadb.collection.create({
                  data: {
                    ownId: theNext?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 3, // le deuxième participant
                    rank: 3,  // son rang sur 1er, 2eme, 3eme participant
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // en update le groupStatus dans collection
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: theNext?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    groupStatus: 3
                  }
                })
                // en update collectionList
                await prismadb.collectionList.updateMany({
                  where: { 
                    ownId: theNext?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                  },
                  data: { 
                    isGroupComplete: true
                  }
                })
              }
            } // S'IL A ÉTÉ RECIPIENT OU DONATOR DU CONNECTED
            else{
              // ON CRÉE UN NOUVEANT TRIPL ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
              await prismadb.collectionList.create({
                data: {
                  ownId: metrics?.nextOwnIdToEnter,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                }
              })
              //
              await prismadb.collection.create({
                data: {
                  ownId: metrics?.nextOwnIdToEnter,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: 1, // le premier participant
                  rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // ON UPDATE LE NEXTOWNID DE +1
              if(metrics?.nextOwnIdToEnter)
                {
                  await prismadb.metric.updateMany({
                    data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                  })
              }
            }
            }
          } // IL EST DÉJÀ DANS LE TRIPL SUIVANT CELUI DU HAUT
          else{
            // ON EN CRÉE UN AUTRE ET ON L'Y ENTRE COMME LE 1ER
            await prismadb.collectionList.create({
              data: {
                ownId: metrics?.nextOwnIdToEnter,
                amount: concernedAmount?.amount,
                collectionType: ctype,
              }
            })
            //
            await prismadb.collection.create({
              data: {
                ownId: metrics?.nextOwnIdToEnter,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                groupStatus: 1, // le premier participant
                rank: 1,  // son rang sur 1er, 2eme, 3eme participant
                googleEmail: connected?.googleEmail,
                usercodepin: connected?.usercodepin,
                profileId: connected?.id
              }
            })
            // ON UPDATE LE NEXTOWNID DE +1
            if(metrics?.nextOwnIdToEnter)
              {
                await prismadb.metric.updateMany({
                  data: { nextOwnIdToEnter: metrics?.nextOwnIdToEnter + 1 }
                })
            }
          }
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
/*
cg (Current Group) : 3
coi (Current Own Id): 1
nooc (number of open collection): 1
###
pour passer le nooc de 1 à 2 il n'y a aucune condition
l'admin update le nooc et le reste se fait naturellement
pareil pour le cg
*/

"use server";
 
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 


// AMOUNT FOUR COLLECTION ENTER 
export const amountFourEnterAction = async () => {
  const metrics = await prismadb.metric.findFirst() // en prod
  // Les profile data du connecté
  const connectedProfile = await currentUserInfos() // en prod
 
  // On selectionne le montant par rapport à sa monnaie
  const myAmountFour = await prismadb.amount.findFirst({
    where: { 
      currency: connectedProfile?.currency,
      rank: "four" // le montant N°4 quel que soit la monnaie 
     }
  })
  // 1- Vérifier s'il a du crédit et si son crédit est >= à amountFour
  if( connectedProfile?.credit && myAmountFour?.amount && connectedProfile.credit >= myAmountFour.amount )
  {
    // 2- Verifier s'il est déjà dans une collecte ouverte ( isgroupcomplete = false ) de amountFour
    const alreadyInCollectionCount = await prismadb.collection.count({
      where: {
        amount: myAmountFour?.amount,
        currency: myAmountFour?.currency,
        collectionType: "snippet",
        email: connectedProfile?.googleEmail,   //
        usercodepin: connectedProfile?.usercodepin,
        isGroupComplete: false
      }
    })
    // il n'est pas déjà dans une collecte ouverte de amountTwo
    if( alreadyInCollectionCount < 1 ) 
    {
      // 3- On compte le nbre de collecte ouverte de amountTwo
      const openCollectionCount = await prismadb.collectionList.count({
        where: {
          amount: myAmountFour?.amount,
          currency: myAmountFour?.currency,
          collectionType: "snippet",
          isGroupComplete: false //important
        }
      })
      // si le nbre trouvé n'est pas == à metrics.currentNbrOfCollection
      if( openCollectionCount !== metrics?.currentNbrOfCollection )
      {
        /* on ne sait pas s'il y a zéro, 1, ou plus de collecte, ouvert ou closed.
        on en crée une, on la donne le metrics.nextOwnIdToEnter. même si le currentNbrOfCollection est
        1, 2 ou plus, ça marchera, il suffira de update le nextOwnIdToEnter a chaque entrée d'un connected */
        if( metrics?.nextOwnIdSnippetToEnter)
        { 
          // Activity Registration
          await prismadb.activity.create({
            data: {
              usercodepin: connectedProfile?.usercodepin,   // en prod
              activity:  "participation à la collecte n° " + metrics.nextOwnIdSnippetToEnter, // String
              concerned:  connectedProfile.googleEmail, // Json?
              action: "entrée dans une collecte snippet de : " + myAmountFour?.amount + myAmountFour?.currency + " de " + metrics.currentgroup + " participants."  // Json?
            }
          })
          // ##
          // On crée la collecte dans collectionList 
          await prismadb.collectionList.create({
            data: {
              ownId: metrics?.nextOwnIdSnippetToEnter,
              amount: myAmountFour?.amount,
              currency: myAmountFour?.currency,
              collectionType: "snippet",
            }
          })
          // On y entre le connected dans collection
          await prismadb.collection.create({
            data: {
              ownId: metrics.nextOwnIdSnippetToEnter,
              amount: myAmountFour?.amount,
              currency: myAmountFour?.currency,
              collectionType: "snippet",
              group: metrics.currentgroup,
              groupStatus: 1,
              email: connectedProfile?.googleEmail,  //
              usercodepin: connectedProfile?.usercodepin,
            }
          })
          // On upadate la metrics.nextOwnIdSnippetToEnter
          const lastCollection = await prismadb.collectionList.findFirst({
            where:{
              collectionType: "snippet"
            },
            orderBy: {
              ownId:"desc"
            }
          })
          if(lastCollection)
          {
            await prismadb.metric.updateMany({
              data: {
                nextOwnIdSnippetToEnter: lastCollection?.ownId + 1
              }
            })
          }
          // On diminue le crédit du connecté de amountFour
          await prismadb.profile.updateMany({   // en prod
            where: { 
              usercodepin: connectedProfile?.usercodepin,
            },
            data: { credit: connectedProfile?.credit - myAmountFour?.amount }
          })
        }
      }
      else{
        if( openCollectionCount === metrics?.currentNbrOfCollection )
        {
          // ####### CURRENT NBR OF COLLECTION === 1
          if(metrics.currentNbrOfCollection === 1)
          {
            // on utilisera donc pas le nextOwnIdSnippetToEnter
            // on select la collecte
            const openCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
                isGroupComplete: false // important
              }
            })
            // on select le groupStatus de la collecte dans collection
            const concernedCollection = await prismadb.collection.findFirst({
              where: {
                ownId: openCollection?.ownId,
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
                isGroupComplete: false // important
              }
            })
            // On y entre le connected dans collection
            if(concernedCollection)
            {
              // Activity Registration
              await prismadb.activity.create({
                data: {
                  usercodepin: connectedProfile?.usercodepin,   // en prod
                  activity:  "participation à la collecte n° " + openCollection?.ownId, // String
                  concerned:  connectedProfile.googleEmail, // Json?
                  action: "entrée dans une collecte snippet de : " + myAmountFour?.amount + myAmountFour?.currency + " de " + metrics.currentgroup + " participants."  // Json?
                }
              })
              // ##
              await prismadb.collection.create({
                data: {
                  ownId: openCollection?.ownId,
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                  group: metrics.currentgroup,
                  groupStatus: concernedCollection?.groupStatus,
                  email: connectedProfile?.googleEmail,       // en prod
                  usercodepin: connectedProfile?.usercodepin,
                }
              })
              // on update le nbre dans le group
              await prismadb.collection.updateMany({
                where: {
                  ownId: openCollection?.ownId,
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                  group: metrics.currentgroup,
                  groupStatus: concernedCollection?.groupStatus,
                }, data: {
                  groupStatus: concernedCollection.groupStatus + 1
                }
              })
            }
            // On diminue le crédit du connecté de amountTwo
            const decreaseCredit = await prismadb.profile.updateMany({   // en prod
              where: { 
                usercodepin: connectedProfile?.usercodepin,
              },
              data: { credit: connectedProfile?.credit - myAmountFour?.amount }
            })
            // on vérifie si le group est complet, on met isgroupComplete = true
            const theConcernedCollection = await prismadb.collection.findFirst({
              where: {
                ownId: openCollection?.ownId,
                amount: myAmountFour?.amount, // important 
                currency: myAmountFour?.currency, // important
                collectionType: "snippet", // important
              }
            })
            if(theConcernedCollection?.groupStatus === theConcernedCollection?.group)
            {
              // update de collectionList
              await prismadb.collectionList.updateMany({
                where: {
                  ownId: openCollection?.ownId,
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                },
                data: {
                  isGroupComplete: true
                }
              })
              // update de collection
              await prismadb.collection.updateMany({
                where: {
                  ownId: openCollection?.ownId,
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                },
                data: {
                  isGroupComplete: true
                }
              })
            }
          }
          // ##
          // ##
          // ####### CURRENT NBR OF COLLECTION === 2
          if(metrics.currentNbrOfCollection === 2)
          {
            // on select la collecte du haut
            const topCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
                isGroupComplete: false // important
              },
              orderBy: {
                ownId: "asc"
              }
            })
            // on count le nbre de participant dans top collection
            const topCollectionCount = await prismadb.collection.count({
              where: {
                ownId: topCollection?.ownId,
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
              }
            })
            // on select la collecte du bas
            const downCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
                isGroupComplete: false // important
              },
              orderBy: {
                ownId: "desc"
              }
            })
            // on count le nbre de participant dans top collection
            const downCollectionCount = await prismadb.collection.count({
              where: {
                ownId: downCollection?.ownId,
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
              }
            })
            // si leur nbre de participants sont égaux
            if(topCollectionCount === downCollectionCount)
            {
              // on select la collecte dans collection
              const collectionOnTop = await prismadb.collection.findFirst({
                where:{
                  ownId: topCollection?.ownId,
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                  isGroupComplete: false // important
                }
              })
              // On entre le connected dans topcollection
              if(collectionOnTop)
              {
                // Activity Registration
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedProfile?.usercodepin,   // en prod
                    activity:  "participation à la collecte n° " + topCollection?.ownId, // String
                    concerned:  connectedProfile.googleEmail, // Json?
                    action: "entrée dans une collecte snippet de : " + myAmountFour?.amount + myAmountFour?.currency + " de " + metrics.currentgroup + " participants."  // Json?
                  }
                })
                // ##
                await prismadb.collection.create({
                  data: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: collectionOnTop?.groupStatus,
                    email: connectedProfile?.googleEmail,  //
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: collectionOnTop?.groupStatus,
                  }, data: {
                    groupStatus: collectionOnTop.groupStatus + 1
                  }
                })
              }
              // On diminue le crédit du connecté de amountOne
              const decreaseCredit = await prismadb.profile.updateMany({   // en prod
                where: { 
                  usercodepin: connectedProfile?.usercodepin,
                },
                data: { credit: connectedProfile?.credit - myAmountFour?.amount }
              })
              // on select la collecte en question après avoir ajouté un participant
              const theConcernedCollection = await prismadb.collection.findFirst({
                where: {
                  ownId: topCollection?.ownId,
                  amount: myAmountFour?.amount, // important 
                  currency: myAmountFour?.currency, // important
                  collectionType: "snippet", // important
                }
              })
              if(theConcernedCollection?.groupStatus === theConcernedCollection?.group)
              {
                // update de collectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // update de collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
              }
            }
            else{
              // topCollectionCount > downCollectionCount
              // on select la collecte dans collection
              const collectionOnBottom = await prismadb.collection.findFirst({
                where:{
                  ownId: downCollection?.ownId,
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                  isGroupComplete: false // important
                }
              })
              if(collectionOnBottom)
              {
                // Activity Registration
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedProfile?.usercodepin,   // en prod
                    activity:  "participation à la collecte n° " + downCollection?.ownId, // String
                    concerned:  connectedProfile.googleEmail, // Json?
                    action: "entrée dans une collecte snippet de : " + myAmountFour?.amount + myAmountFour?.currency + " de " + metrics.currentgroup + " participants."  // Json?
                  }
                })
                // ##
                // On entre le connected dans downcollection
                await prismadb.collection.create({
                  data: {
                    ownId: downCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: collectionOnBottom.groupStatus,
                    email: connectedProfile?.googleEmail,  //
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: downCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: collectionOnBottom?.groupStatus,
                  }, data: {
                    groupStatus: collectionOnBottom.groupStatus + 1
                  }
                })
              }
              // On diminue le crédit du connecté de amountOne
              const decreaseCredit = await prismadb.profile.updateMany({   // en prod
                where: { 
                  usercodepin: connectedProfile?.usercodepin,
                },
                data: { credit: connectedProfile?.credit - myAmountFour?.amount }
              })
            }
          }
          // ##
          // ##
          // ####### CURRENT NBR OF COLLECTION > 2 #
          if(metrics.currentNbrOfCollection > 2)
          {
            // on select la collecte du haut
            const topCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
                isGroupComplete: false // important
              },
              orderBy: {
                ownId: "asc"
              }
            })
            // on count le nbre de participant dans top collection
            const topCollectionCount = await prismadb.collection.count({
              where: {
                ownId: topCollection?.ownId,
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
              }
            })
            // on select la collecte du bas
            const downCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
                isGroupComplete: false // important
              },
              orderBy: {
                ownId: "desc"
              }
            })
            // on count le nbre de participant dans top collection
            const downCollectionCount = await prismadb.collection.count({
              where: {
                ownId: downCollection?.ownId,
                amount: myAmountFour?.amount,
                currency: myAmountFour?.currency,
                collectionType: "snippet",
              }
            })
            // si leur nbre de participants sont égaux
            if(topCollectionCount === downCollectionCount)
            {
              const firstCollectionOnTop = await prismadb.collection.findFirst({
                where: {
                  ownId: topCollection?.ownId,
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                }
              })
              // On entre le connected dans topcollection
              if(firstCollectionOnTop)
              {
                // Activity Registration
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedProfile?.usercodepin,   // en prod
                    activity:  "participation à la collecte n° " + topCollection?.ownId, // String
                    concerned:  connectedProfile.googleEmail, // Json?
                    action: "entrée dans une collecte snippet de : " + myAmountFour?.amount + myAmountFour?.currency + " de " + metrics.currentgroup + " participants."  // Json?
                  }
                })
                // ##
                await prismadb.collection.create({
                  data: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: firstCollectionOnTop?.groupStatus,
                    email: connectedProfile?.googleEmail,  //
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: firstCollectionOnTop?.groupStatus,
                  }, data: {
                    groupStatus: firstCollectionOnTop.groupStatus + 1
                  }
                })
              }
              // On diminue le crédit du connecté de amountTwo
              const decreaseCredit = await prismadb.profile.updateMany({   // en prod
                where: { 
                  usercodepin: connectedProfile?.usercodepin,
                },
                data: { credit: connectedProfile?.credit - myAmountFour?.amount }
              })
              // on select la collecte en question
              const theConcernedCollection = await prismadb.collection.findFirst({
                where: {
                  ownId: topCollection?.ownId,
                  amount: myAmountFour?.amount, // important 
                  currency: myAmountFour?.currency, // important
                  collectionType: "snippet", // important
                }
              })
              // on close le group
              if(theConcernedCollection?.groupStatus === theConcernedCollection?.group)
              {
                // update de collectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // update de collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
              }
            }
            else{
              // topCollectionCount > downCollectionCount
              //
              /* on select la première collecte en partant du haut qui
              a le même nbre de participants que downCollection */
              const nextFirstCollectionOnTop = await prismadb.collection.findFirst({
                where: {
                  amount: myAmountFour?.amount,
                  currency: myAmountFour?.currency,
                  collectionType: "snippet",
                  groupStatus: downCollectionCount,
                  isGroupComplete: false
                },
                orderBy: {
                  ownId: "asc"
                }
              }) 
              // on y entre le conneted
              if(nextFirstCollectionOnTop)
              {
                // Activity Registration
                await prismadb.activity.create({
                  data: {
                    usercodepin: connectedProfile?.usercodepin,   // en prod
                    activity:  "participation à la collecte n° " + nextFirstCollectionOnTop, // String
                    concerned:  connectedProfile.googleEmail, // Json?
                    action: "entrée dans une collecte snippet de : " + myAmountFour?.amount + myAmountFour?.currency + " de " + metrics.currentgroup + " participants."  // Json?
                  }
                })
                // ##
                await prismadb.collection.create({
                  data: {
                    ownId: nextFirstCollectionOnTop?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: nextFirstCollectionOnTop?.groupStatus,
                    email: connectedProfile?.googleEmail,  //
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: nextFirstCollectionOnTop?.ownId,
                    amount: myAmountFour?.amount,
                    currency: myAmountFour?.currency,
                    collectionType: "snippet",
                    group: metrics.currentgroup,
                    groupStatus: nextFirstCollectionOnTop?.groupStatus,
                  }, data: {
                    groupStatus: nextFirstCollectionOnTop.groupStatus + 1
                  }
                })
              }
              // On diminue le crédit du connecté de amountOne
              const decreaseCredit = await prismadb.profile.updateMany({   // en prod
                where: { 
                  usercodepin: connectedProfile?.usercodepin,
                },
                data: { credit: connectedProfile?.credit - myAmountFour?.amount }
              })
              // on select la collecte en question
              const theConcernedCollection = await prismadb.collection.findFirst({
                where: {
                  ownId: nextFirstCollectionOnTop?.ownId,
                  amount: myAmountFour?.amount, // important 
                  currency: myAmountFour?.currency, // important
                  collectionType: "snippet", // important
                }
              })
            } // fin topCollectionCount > downCollectionCount
          }
        }
      }
    }
    else{
      console.log("déjà dans une collecte  isgroupComplete = false")
    }
  } // fin credit exist et >= a amount one ?
  revalidatePath('/dashboard');
  redirect('/dashboard')
}

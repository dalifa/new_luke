"use server";

import { connectedAmountOne, currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 


// AMOUNT ONE TOTALITY COLLECTION ENTER    
export const amountOneTotalityEnterAction = async () => {
  const metrics = await prismadb.metric.findFirst() // en prod
  // Les profile data du connecté
  const connectedProfile = await currentUserInfos() // en prod

  // On selectionne le montant par rapport à sa monnaie
  const myAmountOne = await connectedAmountOne()
  // 1- Vérifier s'il a du crédit et si son crédit est >= à amountOne
  if( connectedProfile?.credit && myAmountOne?.amount && connectedProfile.credit >= myAmountOne.amount )
  {
    // 2- Verifier s'il est déjà dans une collecte ouverte ( isgroupcomplete = false ) de amountOne
    const alreadyInCollectionCount = await prismadb.collection.count({
      where: {
        amount: myAmountOne?.amount,
        currency: myAmountOne?.currency,
        collectionType: "totality",
        email: connectedProfile.googleEmail,  // prod
        usercodepin: connectedProfile?.usercodepin,
        isGroupComplete: false
      }
    })
    // il n'est pas déjà dans une collecte ouverte de amountOne
    if( alreadyInCollectionCount < 1 ) 
    {
      // 3- On compte le nbre de collecte ouverte de amountOne
      const openCollectionCount = await prismadb.collectionList.count({
        where: {
          amount: myAmountOne?.amount,
          currency: myAmountOne?.currency,
          collectionType: "totality",
          isGroupComplete: false //important 
        }
      })
      // si le nbre trouvé n'est pas == à metrics.tocunooc = // Totality Current Nomber Of Collection
      if( openCollectionCount !== metrics?.tocunooc )
      {
        /* on ne sait pas s'il y a zéro, 1, ou plus de collecte, ouvert ou closed.
        on en crée une, on la donne le metrics.noitte. même si le tocunooc est
        1, 2 ou plus, ça marchera, il suffira de update le noitte a chaque entrée d'un connected */
        if( metrics?.noitte)
        { 
          // Activity Registration
          await prismadb.activity.create({
            data: {
              usercodepin: connectedProfile?.usercodepin,   // en prod
              activity:  "participation à la collecte n° " + metrics.noitte, // String
              concerned:  connectedProfile.googleEmail, // Json?
              action: "entrée dans une collecte totality de : " + myAmountOne?.amount + myAmountOne?.currency + " de " + metrics.tcg + " participants."  // Json?
            }
          })
          // ##
          // On crée la collecte dans collectionList 
          await prismadb.collectionList.create({
            data: {
              ownId: metrics?.noitte,
              amount: myAmountOne?.amount,
              currency: myAmountOne?.currency,
              collectionType: "totality",
            }
          })
          // On y entre le connected dans collection
          await prismadb.collection.create({
            data: {
              ownId: metrics.noitte,
              amount: myAmountOne?.amount,
              currency: myAmountOne?.currency,
              collectionType: "totality",
              group: metrics.currentgroup,
              groupStatus: 1,
              email: connectedProfile?.googleEmail,       // en prod
              usercodepin: connectedProfile?.usercodepin,
            }
          })
          // On upadate la metrics.noitte
          const lastCollection = await prismadb.collectionList.findFirst({
            where:{
              collectionType: "totality"
            },
            orderBy: {
              ownId:"desc"
            }
          })
          if(lastCollection)
          {
            await prismadb.metric.updateMany({
              data: {
                noitte: lastCollection?.ownId + 1
              }
            })
          }
          // On diminue le crédit du connecté de amountOne
          const decreaseCredit = await prismadb.profile.updateMany({   // en prod
            where: { 
              usercodepin: connectedProfile?.usercodepin,
            },
            data: { credit: connectedProfile?.credit - myAmountOne?.amount }
          })
        }
      }
      else{
        if( openCollectionCount === metrics?.tocunooc )
        {
          // ####### CURRENT NBR OF COLLECTION === 1
          if(metrics.tocunooc === 1)
          {
            // on utilisera donc pas le next own id totality to enter = noitte
            // on select la collecte
            const openCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
                isGroupComplete: false // important
              }
            })
            // on select le groupStatus de la collecte dans collection
            const concernedCollection = await prismadb.collection.findFirst({
              where: {
                ownId: openCollection?.ownId,
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
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
              action: "entrée dans une collecte totality de : " + myAmountOne?.amount + myAmountOne?.currency + " de " + metrics.tcg + " participants."  // Json?
            }
            })
            // ##
              await prismadb.collection.create({
                data: {
                  ownId: openCollection?.ownId,
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
                  group: metrics.tcg,
                  groupStatus: concernedCollection?.groupStatus,
                  email: connectedProfile?.googleEmail,       // en prod
                  usercodepin: connectedProfile?.usercodepin,
                }
              })
              // on update le nbre dans le group
              await prismadb.collection.updateMany({
                where: {
                  ownId: openCollection?.ownId,
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
                  group: metrics.tcg,
                  groupStatus: concernedCollection?.groupStatus,
                }, data: {
                  groupStatus: concernedCollection.groupStatus + 1
                }
              })
            }
            // On diminue le crédit du connecté de amountOne
            const decreaseCredit = await prismadb.profile.updateMany({   // en prod
              where: { 
                usercodepin: connectedProfile?.usercodepin,
              },
              data: { credit: connectedProfile?.credit - myAmountOne?.amount }
            })
            // on vérifie si le group est complet, on met isgroupComplete = true
            const theConcernedCollection = await prismadb.collection.findFirst({
              where: {
                ownId: openCollection?.ownId,
                amount: myAmountOne?.amount, // important 
                currency: myAmountOne?.currency, // important
                collectionType: "totality", // important
              }
            })
            if(theConcernedCollection?.groupStatus === theConcernedCollection?.group)
            {
              // update de collectionList
              await prismadb.collectionList.updateMany({
                where: {
                  ownId: openCollection?.ownId,
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
                },
                data: {
                  isGroupComplete: true
                }
              })
              // update de collection
              await prismadb.collection.updateMany({
                where: {
                  ownId: openCollection?.ownId,
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
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
          if(metrics.tocunooc === 2)
          {
            // on select la collecte du haut
            const topCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
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
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
              }
            })
            // on select la collecte du bas
            const downCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
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
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
              }
            })
            // si leur nbre de participants sont égaux
            if(topCollectionCount === downCollectionCount)
            {
              // on select la collecte dans collection
              const collectionOnTop = await prismadb.collection.findFirst({
                where:{
                  ownId: topCollection?.ownId,
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
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
                    action: "entrée dans une collecte totality de : " + myAmountOne?.amount + myAmountOne?.currency + " de " + metrics.tcg + " participants."  // Json?
                  }
                })
                // ##
                await prismadb.collection.create({
                  data: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
                    group: metrics.tcg,
                    groupStatus: collectionOnTop?.groupStatus,
                    email: connectedProfile?.googleEmail,       // en prod
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
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
                data: { credit: connectedProfile?.credit - myAmountOne?.amount }
              })
              // on select la collecte en question après avoir ajouté un participant
              const theConcernedCollection = await prismadb.collection.findFirst({
                where: {
                  ownId: topCollection?.ownId,
                  amount: myAmountOne?.amount, // important 
                  currency: myAmountOne?.currency, // important
                  collectionType: "totality", // important
                }
              })
              if(theConcernedCollection?.groupStatus === theConcernedCollection?.group)
              {
                // update de collectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // update de collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
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
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
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
                    action: "entrée dans une collecte totality de : " + myAmountOne?.amount + myAmountOne?.currency + " de " + metrics.tcg + " participants."  // Json?
                  }
                })
                // ##
                // On entre le connected dans downcollection
                await prismadb.collection.create({
                  data: {
                    ownId: downCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
                    group: metrics.currentgroup,
                    groupStatus: collectionOnBottom.groupStatus,
                    email: connectedProfile?.googleEmail,       // en prod
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: downCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
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
                data: { credit: connectedProfile?.credit - myAmountOne?.amount }
              })
            }
          }
          // ##
          // ##
          // ####### TOtality CUrrent NOmber Of COllection > 2 #
          if(metrics.tocunooc > 2)
          {
            // on select la collecte du haut
            const topCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
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
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
              }
            })
            // on select la collecte du bas
            const downCollection = await prismadb.collectionList.findFirst({
              where:{
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
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
                amount: myAmountOne?.amount,
                currency: myAmountOne?.currency,
                collectionType: "totality",
              }
            })
            // si leur nbre de participants sont égaux
            if(topCollectionCount === downCollectionCount)
            {
              const firstCollectionOnTop = await prismadb.collection.findFirst({
                where: {
                  ownId: topCollection?.ownId,
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
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
                    action: "entrée dans une collecte totality de : " + myAmountOne?.amount + myAmountOne?.currency + " de " + metrics.tcg + " participants."  // Json?
                  }
                })
                // ##
                await prismadb.collection.create({
                  data: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
                    group: metrics.currentgroup,
                    groupStatus: firstCollectionOnTop?.groupStatus,
                    email: connectedProfile?.googleEmail,  // en prod
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
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
                data: { credit: connectedProfile?.credit - myAmountOne?.amount }
              })
              // on select la collecte en question
              const theConcernedCollection = await prismadb.collection.findFirst({
                where: {
                  ownId: topCollection?.ownId,
                  amount: myAmountOne?.amount, // important 
                  currency: myAmountOne?.currency, // important
                  collectionType: "totality", // important
                }
              })
              // on close le group
              if(theConcernedCollection?.groupStatus === theConcernedCollection?.group)
              {
                // update de collectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // update de collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
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
                  amount: myAmountOne?.amount,
                  currency: myAmountOne?.currency,
                  collectionType: "totality",
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
                    activity:  "participation à la collecte n° " + nextFirstCollectionOnTop.ownId, // String
                    concerned:  connectedProfile.googleEmail, // Json?
                    action: "entrée dans une collecte totality de : " + myAmountOne?.amount + myAmountOne?.currency + " de " + metrics.tcg + " participants."  // Json?
                  }
                })  
                // ##
                await prismadb.collection.create({
                  data: {
                    ownId: nextFirstCollectionOnTop?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
                    group: metrics.currentgroup,
                    groupStatus: nextFirstCollectionOnTop?.groupStatus,
                    email: connectedProfile?.googleEmail,  // en prod
                    usercodepin: connectedProfile?.usercodepin,
                  }
                })
                // on update le nbre dans le group
                await prismadb.collection.updateMany({
                  where: {
                    ownId: nextFirstCollectionOnTop?.ownId,
                    amount: myAmountOne?.amount,
                    currency: myAmountOne?.currency,
                    collectionType: "totality",
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
                data: { credit: connectedProfile?.credit - myAmountOne?.amount }
              })
              // on select la collecte en question 
              const theConcernedCollection = await prismadb.collection.findFirst({
                where: {
                  ownId: nextFirstCollectionOnTop?.ownId,
                  amount: myAmountOne?.amount, // important 
                  currency: myAmountOne?.currency, // important
                  collectionType: "totality", // important
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

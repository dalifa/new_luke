"use server";

import { auth } from "@/auth";
import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

 
// à la place de params je peux mettre id (qui représente id du fichier donationId) 
  export async function donationAmountAction(params: string) {
  // l'id du recipient choisi (son id dans la collecte: table collection ) 
  // console.log("le recipient est: ", params) // ça marche   
  const connectedProfile = await currentUserInfos()
  // recipientId in collection table == params 
  // recipient collection datas 
  const recipientCollectionData = await prismadb.collection.findFirst({
    where: { id: params }
  })
  // recipient profile 
  const recipientProfile = await prismadb.profile.findFirst({
    where: { 
      usercodepin: recipientCollectionData?.usercodepin,
    }
  })

  // on vérifie si la collecte concerné est pas cloturée et son group est bien complet
  if(recipientCollectionData?.isGroupComplete === true && recipientCollectionData.isCollectionClosed === false)
  {
    // on vérifie que le connecté est bien dans la même collecte que le recipient
    const inTheSameCollection = await prismadb.collection.count({
      where: {
        usercodepin: connectedProfile?.usercodepin,  // en prod
        ownId: recipientCollectionData.ownId, // obligatoire
        amount: recipientCollectionData.amount, // obligatoire
        currency: recipientCollectionData.currency, // obligatoire
        collectionType: recipientCollectionData.collectionType // obligatoire
      }
    })
    //
    if(inTheSameCollection === 1)
    {
      // on vérifie que le connecté n'ait pas encore donné 
      const connectedCollectionData = await prismadb.collection.findFirst({
        where: {
          usercodepin: connectedProfile?.usercodepin,  // en prod
          ownId: recipientCollectionData.ownId,
          amount: recipientCollectionData.amount, // obligatoire
          currency: recipientCollectionData.currency, // obligatoire
          collectionType: recipientCollectionData.collectionType // obligatoire
        }
      })
      //
      if(connectedCollectionData?.hasGive === false)
      { 
        // on update collection on met hasgive du connected à true 
        await prismadb.collection.updateMany({
          where: {
            usercodepin: connectedCollectionData.usercodepin,
            ownId: connectedCollectionData.ownId, // obligatoire
            amount : connectedCollectionData?.amount, // obligatoire
            currency : connectedCollectionData?.currency, // obligatoire
            collectionType: connectedCollectionData?.collectionType, // obligatoire
            // il faut mettre ces 5 fields pour bien différencier la collecte 
            // d'autres collectes de somme ou type différents
          },
          data: {
            hasGive: true
          }
        })
        // Activity Registration
        await prismadb.activity.create({
          data: {
            usercodepin: connectedProfile?.usercodepin,   // en prod
            activity:  "don dans une collecte", // String
            concerned: "le destinataire du don est: " + recipientCollectionData?.usercodepin + ".", // Json?
            action: "don de : " + recipientCollectionData?.amount + recipientCollectionData?.currency + " dans une collecte " + recipientCollectionData.collectionType + " de ownId: " + recipientCollectionData.ownId  // Json?
          }
        })
        // on count si il y a un donator rank
        const rank = await prismadb.collectionResult.count({
          where:{
            collectionOwnId: recipientCollectionData?.ownId,
            amount: recipientCollectionData?.amount,
            currency: recipientCollectionData?.currency,
            collectionType: recipientCollectionData?.collectionType,
          }
        })
        if(rank === 0)
        {
          // ##
          // on enregistre le don du connecté à recipient dans la table CollectionResult
          await prismadb.collectionResult.create({
            data: {
              donatorcodepin: connectedCollectionData?.usercodepin,
              donatorEmail: connectedCollectionData?.email,
              donatorRank: 1,
              collectionOwnId: recipientCollectionData?.ownId,
              amount: recipientCollectionData?.amount,
              currency: recipientCollectionData?.currency,
              collectionType: recipientCollectionData?.collectionType,
              recipientcodepin: recipientCollectionData?.usercodepin,
              recipientEmail: recipientCollectionData?.email
            }
          })
        }else{
          // rank > 0
          const rankExist = await prismadb.collectionResult.findFirst({
            where:{
              collectionOwnId: recipientCollectionData?.ownId,
              amount: recipientCollectionData?.amount,
              currency: recipientCollectionData?.currency,
              collectionType: recipientCollectionData?.collectionType,
            },
            orderBy: {id: "desc"} // si 1 on select 1 / si 1 et 2 on select 2
          })
          // 
          if(rankExist)  // on s'assure qu'il exist
          {
            await prismadb.collectionResult.create({
              data: {
                donatorcodepin: connectedCollectionData?.usercodepin,
                donatorEmail: connectedCollectionData?.email,
                donatorRank: rankExist?.donatorRank + 1,
                collectionOwnId: recipientCollectionData?.ownId,
                amount: recipientCollectionData?.amount,
                currency: recipientCollectionData?.currency,
                collectionType: recipientCollectionData?.collectionType,
                recipientcodepin: recipientCollectionData?.usercodepin,
                recipientEmail: recipientCollectionData?.email
              }
            })
          }
        }
        //
        // ##### COLLECTION SNIPPET
        if (recipientCollectionData?.collectionType === "snippet")
        {
          // on update le jackpot du recipient + amount
          const myJackpot = await prismadb.profile.findFirst({
            where: { 
              googleEmail: recipientProfile?.googleEmail,
              usercodepin: recipientCollectionData.usercodepin
            }
          })
          //
          if(myJackpot)
          {
            await prismadb.profile.updateMany({
              where: { usercodepin: recipientCollectionData.usercodepin },
              data: { jackpot: myJackpot.jackpot + recipientCollectionData?.amount}
            })
          }
          //
          const allHasGive = await prismadb.collection.count({
            where: {
              ownId: recipientCollectionData?.ownId, // obligatoire
              amount : recipientCollectionData?.amount, // obligatoire
              currency : recipientCollectionData?.currency, // obligatoire
              collectionType: recipientCollectionData?.collectionType, // obligatoire
              //
              hasGive: true  // très important
            }
          })
          //
          if(recipientCollectionData.group === allHasGive)
          {
            console.log(allHasGive + " ont donné")
            // on close la collecte dans collection
            const closeCollection = await prismadb.collection.updateMany({
            where: {
              ownId: recipientCollectionData?.ownId, // obligatoire
              amount : recipientCollectionData?.amount, // obligatoire
              currency : recipientCollectionData?.currency, // obligatoire
              collectionType: recipientCollectionData?.collectionType, // obligatoire
              // supllément
              hasGive: true
            },
            data: {
              isCollectionClosed: true
            }
            })
            // on close la collecte dans collectionList
            const closeCollectionList = await prismadb.collectionList.updateMany({
            where: {
              ownId: recipientCollectionData.ownId, // obligatoire
              amount : recipientCollectionData?.amount, // obligatoire
              currency : recipientCollectionData?.currency, // obligatoire
              collectionType: recipientCollectionData?.collectionType, // obligatoire
              // supplément
              isGroupComplete: true
            },
            data: {
              isCollectionClosed: true
            }
            })
          }
        }
// ###############################################################################        
// ############### COLLECTION TOTALITY
        if (recipientCollectionData?.collectionType === "totality"){
          // on select le nbre of donation received par ce recipient
          const countNuodore = await prismadb.collectionResult.findFirst({
            where: {
              collectionOwnId: recipientCollectionData?.ownId,
              amount: recipientCollectionData?.amount,
              currency: recipientCollectionData?.currency,
              collectionType: recipientCollectionData?.collectionType,
              recipientcodepin: recipientCollectionData?.usercodepin,
              recipientEmail: recipientCollectionData?.email
            }
          })
          // nuodore = numbre of donation received
          if(countNuodore){
            await prismadb.collectionResult.updateMany({
              where: {
                //donatorcodepin: connectedCollectionData?.usercodepin,
                //donatorEmail: connectedCollectionData?.email,
                collectionOwnId: recipientCollectionData?.ownId,
                amount: recipientCollectionData?.amount,
                currency: recipientCollectionData?.currency,
                collectionType: recipientCollectionData?.collectionType,
                recipientcodepin: recipientCollectionData?.usercodepin,
                recipientEmail: recipientCollectionData?.email
              },
              data: {
                nuodore: countNuodore?.nuodore + 1
              }
            })
          } 
          //
          // on compte ceux qui ont donné
          const allHasGive = await prismadb.collection.count({
          where: {
            ownId: recipientCollectionData?.ownId, // obligatoire
            amount : recipientCollectionData?.amount, // obligatoire
            currency : recipientCollectionData?.currency, // obligatoire
            collectionType: recipientCollectionData?.collectionType, // obligatoire
            //
            hasGive: true  // très important
          }
        })
        // on vérifie si ceux qui ont donné sont == à ceux qui y participe
        if(recipientCollectionData.group === allHasGive)
        {
          console.log(allHasGive + " ont donné")
          // on close la collecte dans collection
          const closeCollection = await prismadb.collection.updateMany({
            where: {
              ownId: recipientCollectionData?.ownId, // obligatoire
              amount : recipientCollectionData?.amount, // obligatoire
              currency : recipientCollectionData?.currency, // obligatoire
              collectionType: recipientCollectionData?.collectionType, // obligatoire
              // supllément
              hasGive: true
            },
            data: {
              isCollectionClosed: true
            }
          })
          // on close la collecte dans collectionList
          const closeCollectionList = await prismadb.collectionList.updateMany({
            where: {
              ownId: recipientCollectionData.ownId, // obligatoire
              amount : recipientCollectionData?.amount, // obligatoire
              currency : recipientCollectionData?.currency, // obligatoire
              collectionType: recipientCollectionData?.collectionType, // obligatoire
              // supplément
              isGroupComplete: true
            },
            data: {
              isCollectionClosed: true
            }
          })
          
          // un participant avec nuodore === 1 => il y a 2 fois nuodore = 2
          const winnerCount = await prismadb.collectionResult.count({
            where:{
              collectionOwnId: recipientCollectionData?.ownId,
              amount: recipientCollectionData?.amount,
              currency: recipientCollectionData?.currency,
              collectionType: recipientCollectionData?.collectionType,
              nuodore: 1
            }
          }) 
          if(winnerCount === 1)
          {
            // on select le winner dans collection result (c'est un recipient)
            const winner = await prismadb.collectionResult.findFirst({
              where: {
                collectionOwnId: recipientCollectionData?.ownId,
                amount: recipientCollectionData?.amount,
                currency: recipientCollectionData?.currency,
                collectionType: recipientCollectionData?.collectionType,
                // le nuodore c'est toujours pour le recipient
                nuodore: 2
              }
            })
            // ON LUI DONNE LA CAGNOTTE
            // on update le jackpot du recipient + (3 x amount)
            const winnerProfile = await prismadb.profile.findFirst({
              where: { 
                googleEmail: winner?.recipientEmail,
                usercodepin: winner?.recipientcodepin
              }
            })
            //
            if(winnerProfile)
            {
              console.log("le winner est " + winnerProfile?.googleEmail)
              // La Cagnotte = recipientCollectionData?.amount multiplier par 3
              // 2 x amount seront ajouté au jackpot
              // 1 x amount représentant sa somme de depart sera remis dans son crédit
              const theCagnotte = (recipientCollectionData?.amount + recipientCollectionData?.amount)
              await prismadb.profile.updateMany({
                where: { 
                  googleEmail: winnerProfile?.googleEmail,
                  usercodepin: winnerProfile?.usercodepin
                },
                data: { 
                  jackpot: winnerProfile.jackpot + theCagnotte,
                  credit: winnerProfile.credit + recipientCollectionData?.amount
                }
              })
            }
          }
          else{
                // on remet a chaque participant son Amount
                // participant de rank = 1
                const theOne = await prismadb.collectionResult.findFirst({
                  where:{
                    collectionOwnId: recipientCollectionData?.ownId,
                    amount: recipientCollectionData?.amount,
                    currency: recipientCollectionData?.currency,
                    collectionType: recipientCollectionData?.collectionType,
                    donatorRank: 1
                  }
                })
                // on select son credit
                const theOneJackpot = await prismadb.profile.findFirst({
                  where: {
                    googleEmail: theOne?.donatorEmail,
                    usercodepin: theOne?.donatorcodepin
                  }
                })
                if(theOneJackpot){
                  // on update son credit
                  await prismadb.profile.updateMany({
                    where:{
                      googleEmail: theOneJackpot?.googleEmail,
                      usercodepin: theOneJackpot?.usercodepin
                    },
                    data: {
                      credit: theOneJackpot?.credit + recipientCollectionData?.amount
                    }
                  })
                }
                // participant de rank = 2
                const theTwo = await prismadb.collectionResult.findFirst({
                  where:{
                    collectionOwnId: recipientCollectionData?.ownId,
                    amount: recipientCollectionData?.amount,
                    currency: recipientCollectionData?.currency,
                    collectionType: recipientCollectionData?.collectionType,
                    donatorRank: 2
                  }
                })
                // on select son credit
                const theTwoJackpot = await prismadb.profile.findFirst({
                  where: {
                    googleEmail: theTwo?.donatorEmail,
                    usercodepin: theTwo?.donatorcodepin
                  }
                })
                if(theTwoJackpot){
                  // on update son credit
                  await prismadb.profile.updateMany({
                    where:{
                      googleEmail: theTwoJackpot?.googleEmail,
                      usercodepin: theTwoJackpot?.usercodepin
                    },
                    data: {
                      credit: theTwoJackpot?.credit + recipientCollectionData?.amount
                    }
                  })
                }
                // participant de rank = 3
                const theThree = await prismadb.collectionResult.findFirst({
                  where:{
                    collectionOwnId: recipientCollectionData?.ownId,
                    amount: recipientCollectionData?.amount,
                    currency: recipientCollectionData?.currency,
                    collectionType: recipientCollectionData?.collectionType,
                    donatorRank: 3
                  }
                })
                // on select son credit
                const theThreeJackpot = await prismadb.profile.findFirst({
                  where: {
                    googleEmail: theThree?.donatorEmail,
                    usercodepin: theThree?.donatorcodepin
                  }
                })
                if(theThreeJackpot){
                  // on update son credit
                  await prismadb.profile.updateMany({
                    where:{
                      googleEmail: theThreeJackpot?.googleEmail,
                      usercodepin: theThreeJackpot?.usercodepin
                    },
                    data: {
                      credit: theThreeJackpot?.credit + recipientCollectionData?.amount
                    }
                  })
                }
              }//
          }
        }

        
        revalidatePath('/dashboard')
        redirect("/dashboard")
      } // donation registered 
    }
  }
  //
}

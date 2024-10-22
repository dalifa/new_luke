"use server";

import { currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// COLLECTION ENTER 
export const enterInSnippetsCollectionAction = async (params:string) => {
  try 
  {
    // LE MONTANT CHOISI PAR LE CONNECTÉ
    const concernedAmount = await prismadb.amount.findFirst({
      where: { id: params }
    })
    // LE TYPE DE COLLECTE
    const ctype = "snippets"
    /*
      cgs   // Current Group Snippets
      nois  // Next Own Id Snippets
      noos  // Number Of Open Snippets
      ###
      pour passer le noos de 1 à 2 il n'y a aucune condition
      l'admin update le noos et le reste se fait naturellement
      pareil pour le cgs
    */
    const metrics = await prismadb.metric.findFirst() // en prod
    // LE PROFIL DU CONCERNÉ
    const connected = await currentUserInfos() // en prod
    // 1- ON VERIFIE SON CREDIT
    if( connected?.credit && concernedAmount && connected.credit >= concernedAmount?.amount )
    {
      // ON DIMINU SON CREDIT DU MONTANT CHOISI
      const newCredit = ( connected?.credit - concernedAmount?.amount )
      // 
      await prismadb.profile.updateMany({
        where: { googleEmail: connected?.googleEmail },
        data: { credit: newCredit }
      })
      // ON COMPTE COMBIEN Y'A DE COLLECTE D'OUVERT
      const openCollectionCount = await prismadb.collectionList.count({
        where: {
          amount: concernedAmount?.amount,
          isGroupComplete: false,
          collectionType: ctype
        }
      })
      // ##
      // ############ ZÉRO COLLECTTE D'OUVERTE #################################
      if(openCollectionCount === 0)
      {
        // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
        await prismadb.collectionList.create({
          data: {
            ownId: metrics?.nois, // nois = next own id snippets
            amount: concernedAmount?.amount,
            collectionType: ctype
          }
        })
        //
        await prismadb.collection.create({
          data: {
            ownId: metrics?.nois,
            amount: concernedAmount?.amount,
            collectionType: ctype,
            groupStatus: 1, // le premier participant
            rank: 1,  // son rang surnbre de participants
            googleEmail: connected?.googleEmail,
            usercodepin: connected?.usercodepin,
            profileId: connected?.id
          }
        })
        // on select l'id qui vient d'être crée
        const theCollectionId = await prismadb.collection.findFirst({
          where: { 
            ownId: metrics?.nois,
            googleEmail:connected?.googleEmail
          }
        })
        // ON UPDATE LE NOIS DE +1
        if(metrics?.nois)
        {
          await prismadb.metric.updateMany({
            data: { nois: metrics?.nois + 1 }
          })
        }
      }
      // ##  
      // ############ LE NOOS EST > AU NBRE DE COLLECTE OUVERT #################
      if( metrics?.noos && metrics?.noos > openCollectionCount && openCollectionCount > 0 )
      {
        // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
        await prismadb.collectionList.create({
          data: {
            ownId: metrics?.nois, // nois = next own id snippets
            amount: concernedAmount?.amount,
            collectionType: ctype
          }
        })
        //
        await prismadb.collection.create({
          data: {
            ownId: metrics?.nois,
            amount: concernedAmount?.amount,
            collectionType: ctype,
            groupStatus: 1, // le premier participant
            rank: 1,  // son rang surnbre de participants
            googleEmail: connected?.googleEmail,
            usercodepin: connected?.usercodepin,
            profileId: connected?.id
          }
        })
        // on select l'id qui vient d'être crée
        const theCollectionId = await prismadb.collection.findFirst({
          where: { 
            ownId: metrics?.nois,
            googleEmail:connected?.googleEmail
          }
        })
        // ON UPDATE LE NOIS DE +1
        if(metrics?.nois)
        {
          await prismadb.metric.updateMany({
            data: { nois: metrics?.nois + 1 }
          })
        }
      }
      // ##
      // ############ LE NOOS EST === AU NBRE DE COLLECTE OUVERT ###############
      //############# OU LE NOOS EST < AU NBRE DE COLLECTE OUVERT ##############
      // noos = number of open snippets 
      if( ( metrics?.noos && metrics?.noos === openCollectionCount && openCollectionCount > 0) || (metrics?.noos && metrics?.noos < openCollectionCount && openCollectionCount > 0) )
      {
        // openCollectionCount === 1
        if( openCollectionCount === 1) 
        {
          // on select le ownId de la collecte en question
          const currentCollection = await prismadb.collection.findFirst({
            take: 1, // pour select le premier participant
            where: {
              amount: concernedAmount?.amount,
              isGroupComplete:false,
              collectionType: ctype
            }
          })
          // on vérifie s'il est déjà dedans
          const inCollectionCount = await prismadb.collection.count({
            where: { 
              googleEmail: connected?.googleEmail,
              ownId: currentCollection?.ownId,
              amount: currentCollection?.amount,
              collectionType: currentCollection?.collectionType
            }
          })
          // s'il n'est pas dedans
          if(inCollectionCount < 1 && currentCollection)
          {
            // on le rentre avec le un rank = currentCollection?.groupStatus + 1
            await prismadb.collection.create({
              data: {
                ownId: currentCollection?.ownId,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                groupStatus: currentCollection?.groupStatus + 1, // nbre participants présent
                rank: currentCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                googleEmail: connected?.googleEmail,
                usercodepin: connected?.usercodepin,
                profileId: connected?.id
              }
            })
            // on select l'id qui vient d'être crée
            const theCollectionId = await prismadb.collection.findFirst({
              where: { 
                ownId: currentCollection?.ownId,
                googleEmail:connected?.googleEmail
              }
            })
            // on update le groupStatus pour tous
            await prismadb.collection.updateMany({
              where: { 
                ownId: currentCollection?.ownId,
                amount: concernedAmount?.amount,
                collectionType: ctype
              },
              data: { groupStatus: currentCollection?.groupStatus + 1 }
            })
            // si le group est complet on met isgroupeComplete à true
            if( currentCollection?.groupStatus + 1 === currentCollection?.group )
            {
              // on update colectionList
              await prismadb.collectionList.updateMany({
                where: {
                  ownId: currentCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: {
                  isGroupComplete: true
                }
              })
              // on update collection
              await prismadb.collection.updateMany({
                where: {
                  ownId: currentCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: {
                  isGroupComplete: true
                }
              })
            }
          } // s'il est déjà dans currentCollection 
          // ON CRÉE UNE AUTRE COLLECTE ET ON L'ENTRE COMME RANK = 1
          else{
            await prismadb.collectionList.create({
              data: {
                ownId: metrics?.nois, // nois = next own id snippets
                amount: concernedAmount?.amount,
                collectionType: ctype
              }
            })
            //
            await prismadb.collection.create({
              data: {
                ownId: metrics?.nois,
                amount: concernedAmount?.amount,
                collectionType: ctype,
                groupStatus: 1, // le premier participant
                rank: 1,  // son rang surnbre de participants
                googleEmail: connected?.googleEmail,
                usercodepin: connected?.usercodepin,
                profileId: connected?.id
              }
            })
            // on select l'id qui vient d'être crée
            const theCollectionId = await prismadb.collection.findFirst({
              where: { 
                ownId: metrics?.nois,
                googleEmail:connected?.googleEmail
              }
            })
            // ON UPDATE LE NOIS DE +1
            if(metrics?.nois)
            {
              await prismadb.metric.updateMany({
                data: { nois: metrics?.nois + 1 }
              })
            }
          }
        } 
        // ###### FIN 1 ### CHECK OK #################################################
        // *******
        // *******
        // *******
        // openCollectionCount === 2 
        if( openCollectionCount === 2)
        {
          // on select le ownId de la collecte du haut dans collectionList
          const topInList = await prismadb.collectionList.findFirst({
            where: {
              amount: concernedAmount?.amount,
              isGroupComplete:false,
              collectionType: ctype
            },
            orderBy: { ownId: "asc"}
          })
          // on select le ownId de la collecte du haut
          const topCollection = await prismadb.collection.findFirst({
            take: 1, // pour select le premier participant
            where: {
              ownId: topInList?.ownId,
              amount: concernedAmount?.amount,
              isGroupComplete:false,
              collectionType: ctype
            }
          })
          // on select le ownId de la collecte du bas dans collectionList
          const bottomInList = await prismadb.collectionList.findFirst({
            where: {
              amount: concernedAmount?.amount,
              isGroupComplete:false,
              collectionType: ctype
            },
            orderBy: { ownId: "desc"}
          })
          // on select le ownId de la collecte d'en bas
          const bottomCollection = await prismadb.collection.findFirst({
            take: 1, // pour select le premier participant
            where: {
              ownId: bottomInList?.ownId,
              amount: concernedAmount?.amount,
              isGroupComplete:false,
              collectionType: ctype
            }
          })
          // on compare le nbre de participants dans chaque collecte
          // ##### DEBUT TOP === BOTTOM ##### CHECK OK ##############################
          if(topCollection && bottomCollection && topCollection?.groupStatus === bottomCollection?.groupStatus)
          {
            // on vérifie s'il est déjà dans le top collection
            const inTopCollectionCount = await prismadb.collection.count({
              where: { 
                googleEmail: connected?.googleEmail,
                ownId: topCollection?.ownId,
                amount: topCollection?.amount,
                collectionType: topCollection?.collectionType
              }
            })
            // il n'est pas dans la collecte du haut
            if(inTopCollectionCount < 1)
            { 
              // on le rentre avec un rank = topCollection?.groupStatus + 1
              await prismadb.collection.create({
                data: {
                  ownId: topCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: topCollection?.groupStatus + 1, // nbre participants présent
                  rank: topCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // on select l'id qui vient d'être crée
              const theCollectionId = await prismadb.collection.findFirst({
                where: { 
                  ownId: topCollection?.ownId,
                  googleEmail:connected?.googleEmail
                }
              })
              // on update le groupStatus pour tous
              await prismadb.collection.updateMany({
                where: { 
                  ownId: topCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: { groupStatus: topCollection?.groupStatus + 1 }
              })
              // si le group est complet on met isgroupeComplete à true
              if( topCollection?.groupStatus + 1 === topCollection?.group )
              {
                // on update colectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // on update collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
              }
            } // S'IL EST DANS LA TOP, ON VA A LA BOTTOM
            else{
              // on vérifie s'il est déjà dans la collection du bas
              const inBottomCollectionCount = await prismadb.collection.count({
                where: { 
                  googleEmail: connected?.googleEmail,
                  ownId: bottomCollection?.ownId,
                  amount: bottomCollection?.amount,
                  collectionType: bottomCollection?.collectionType
                }
              })
              // IL N'EST PAS DANS LA BOTTOM
              if(inBottomCollectionCount < 1)
              { 
                // on le rentre avec un rank = bottomCollection?.groupStatus + 1
                await prismadb.collection.create({
                  data: {
                    ownId: bottomCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: bottomCollection?.groupStatus + 1, // nbre participants présent
                    rank: bottomCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // on select l'id qui vient d'être crée
                const theCollectionId = await prismadb.collection.findFirst({
                  where: { 
                    ownId: bottomCollection?.ownId,
                    googleEmail:connected?.googleEmail
                  }
                })
                // on update le groupStatus pour tous
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: bottomCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: { groupStatus: bottomCollection?.groupStatus + 1 }
                })
                // si le group est complet on met isgroupeComplete à true
                if( bottomCollection?.groupStatus + 1 === bottomCollection?.group )
                {
                  // on update colectionList
                  await prismadb.collectionList.updateMany({
                    where: {
                      ownId: bottomCollection?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    },
                    data: {
                      isGroupComplete: true
                    }
                  })
                  // on update collection
                  await prismadb.collection.updateMany({
                    where: {
                      ownId: bottomCollection?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    },
                    data: {
                      isGroupComplete: true
                    }
                  })
                }
              } // IL EST AUSSI DANS LA BOTTOM, ON CRÉE UNE NOUVELLE
              else{
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.nois, // nois = next own id snippets
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.nois,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang surnbre de participants
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // on select l'id qui vient d'être crée
                const theCollectionId = await prismadb.collection.findFirst({
                  where: { 
                    ownId: metrics?.nois,
                    googleEmail:connected?.googleEmail
                  }
                })
                // ON UPDATE LE NOIS DE +1
                if(metrics?.nois)
                {
                  await prismadb.metric.updateMany({
                    data: { nois: metrics?.nois + 1 }
                  })
                }
              }
            } 
          }
          // ##### FIN TOP === BOTTOM ##### CHECK OK ################################
          // ****
          // ##### DEBUT TOP > BOTTOM ##### CHECK OK ################################
          if(topCollection && bottomCollection && topCollection?.groupStatus > bottomCollection?.groupStatus)
          {
            // on vérifie s'il est déjà dans la collecte du bas
            const inBottomCollectionCount = await prismadb.collection.count({
              where: { 
                googleEmail: connected?.googleEmail,
                ownId: bottomCollection?.ownId,
                amount: bottomCollection?.amount,
                collectionType: bottomCollection?.collectionType
              }
            })
            if(inBottomCollectionCount < 1)
            {
              // on ajoute un participant au bottom collection
              // on le rentre avec le un rank = bottomCollection?.groupStatus + 1
              await prismadb.collection.create({
                data: {
                  ownId: bottomCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: bottomCollection?.groupStatus + 1, // nbre participants présent
                  rank: bottomCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // on select l'id qui vient d'être crée
              const theCollectionId = await prismadb.collection.findFirst({
                where: { 
                  ownId: bottomCollection?.ownId,
                  googleEmail:connected?.googleEmail
                }
              })
              // on update le groupStatus pour tous
              await prismadb.collection.updateMany({
                where: { 
                  ownId: bottomCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: { groupStatus: bottomCollection?.groupStatus + 1 }
              })
              // si le group est complet on met isgroupeComplete à true
              if( bottomCollection?.groupStatus + 1 === bottomCollection?.group )
              {
                // on update colectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: bottomCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // on update collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: bottomCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
              }
            } // on va vers celle du haut
            else{
                  // on vérifie s'il est déjà dans la collecte du haut
                  const inTopCollectionCount = await prismadb.collection.count({
                    where: { 
                      googleEmail: connected?.googleEmail,
                      ownId: topCollection?.ownId,
                      amount: topCollection?.amount,
                      collectionType: topCollection?.collectionType
                    }
                  })
                  if(inTopCollectionCount < 1)
                  {
                    // on ajoute un participant au top collection
                    // on le rentre avec le un rank = topCollection?.groupStatus + 1
                    await prismadb.collection.create({
                      data: {
                        ownId: topCollection?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype,
                        groupStatus: topCollection?.groupStatus + 1, // nbre participants présent
                        rank: topCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                        googleEmail: connected?.googleEmail,
                        usercodepin: connected?.usercodepin,
                        profileId: connected?.id
                      }
                    })
                    // on select l'id qui vient d'être crée
                    const theCollectionId = await prismadb.collection.findFirst({
                      where: { 
                        ownId: topCollection?.ownId,
                        googleEmail:connected?.googleEmail
                      }
                    })
                    // on update le groupStatus pour tous
                    await prismadb.collection.updateMany({
                      where: { 
                        ownId: topCollection?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype
                      },
                      data: { groupStatus: topCollection?.groupStatus + 1 }
                    })
                    // si le group est complet on met isgroupeComplete à true
                    if( topCollection?.groupStatus + 1 === topCollection?.group )
                    {
                      // on update colectionList
                      await prismadb.collectionList.updateMany({
                        where: {
                          ownId: topCollection?.ownId,
                          amount: concernedAmount?.amount,
                          collectionType: ctype
                        },
                        data: {
                          isGroupComplete: true
                        }
                      })
                      // on update collection
                      await prismadb.collection.updateMany({
                        where: {
                          ownId: topCollection?.ownId,
                          amount: concernedAmount?.amount,
                          collectionType: ctype
                        },
                        data: {
                          isGroupComplete: true
                        }
                      })
                    }
                  } // ON EN CRÉE UN ET ON L'Y ENTRE COMME PREMIER PARTICIPANT
                  else{
                        await prismadb.collectionList.create({
                          data: {
                            ownId: metrics?.nois, // nois = next own id snippets
                            amount: concernedAmount?.amount,
                            collectionType: ctype
                          }
                        })
                        //
                        await prismadb.collection.create({
                          data: {
                            ownId: metrics?.nois,
                            amount: concernedAmount?.amount,
                            collectionType: ctype,
                            groupStatus: 1, // le premier participant
                            rank: 1,  // son rang surnbre de participants
                            googleEmail: connected?.googleEmail,
                            usercodepin: connected?.usercodepin,
                            profileId: connected?.id
                          }
                        })
                        // on select l'id qui vient d'être crée
                        const theCollectionId = await prismadb.collection.findFirst({
                          where: { 
                            ownId: metrics?.nois,
                            googleEmail:connected?.googleEmail
                          }
                        })
                        // ON UPDATE LE NOIS DE +1
                        if(metrics?.nois)
                        {
                          await prismadb.metric.updateMany({
                            data: { nois: metrics?.nois + 1 }
                          })
                        }
                      }
                }
          }
          // ##### FIN TOP > BOTTOM ##### CHECK OK ##################################
          // ****
          // ##### DEBUT TOP < BOTTOM ##### CHECK OK ##################################
          if(topCollection && bottomCollection && topCollection?.groupStatus < bottomCollection?.groupStatus)
          {
            // on va vers le top
            const inTopCount = await prismadb.collection.count({
              where: {
                ownId: topCollection?.ownId,
                amount: topCollection?.amount,
                collectionType: topCollection?.collectionType,
                googleEmail: connected?.googleEmail
              }
            })
            // IL N'EST PAS DANS LE TOP
            if(inTopCount < 1)
            {
              // on ajoute un participant au top collection
              // on le rentre avec le un rank = topCollection?.groupStatus + 1
              await prismadb.collection.create({
                data: {
                  ownId: topCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: topCollection?.groupStatus + 1, // nbre participants présent
                  rank: topCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // on select l'id qui vient d'être crée
              const theCollectionId = await prismadb.collection.findFirst({
                where: { 
                  ownId: topCollection?.ownId,
                  googleEmail:connected?.googleEmail
                }
              })
              // on update le groupStatus pour tous
              await prismadb.collection.updateMany({
                where: { 
                  ownId: topCollection?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: { groupStatus: topCollection?.groupStatus + 1 }
              })
              // si le group est complet on met isgroupeComplete à true
              if( topCollection?.groupStatus + 1 === topCollection?.group )
              {
                // on update colectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // on update collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
              }
            }
            // IL EST DANS LE TOP, ON VA VERS LE BOTTOM
            else{
              const inBottomCount = await prismadb.collection.count({
                where: {
                  ownId: bottomCollection?.ownId,
                  amount: bottomCollection?.amount,
                  collectionType: bottomCollection?.collectionType,
                  googleEmail: connected?.googleEmail
                }
              })
              // LI N'EST PAS DANS LE BOTTOM
              if(inBottomCount < 1)
              {
                // on ajoute un participant au bottom collection
                // on le rentre avec le un rank = bottomCollection?.groupStatus + 1
                await prismadb.collection.create({
                  data: {
                    ownId: bottomCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: bottomCollection?.groupStatus + 1, // nbre participants présent
                    rank: bottomCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // on select l'id qui vient d'être crée
                const theCollectionId = await prismadb.collection.findFirst({
                  where: { 
                    ownId: bottomCollection?.ownId,
                    googleEmail:connected?.googleEmail
                  }
                })
                // on update le groupStatus pour tous
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: bottomCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: { groupStatus: bottomCollection?.groupStatus + 1 }
                })
                // si le group est complet on met isgroupeComplete à true
                if( bottomCollection?.groupStatus + 1 === bottomCollection?.group )
                {
                  // on update colectionList
                  await prismadb.collectionList.updateMany({
                    where: {
                      ownId: bottomCollection?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    },
                    data: {
                      isGroupComplete: true
                    }
                  })
                  // on update collection
                  await prismadb.collection.updateMany({
                    where: {
                      ownId: bottomCollection?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    },
                    data: {
                      isGroupComplete: true
                    }
                  })
                }
              }// on crée une nouvelle collecte et on l'y entre
              else{
                // ON EN CRÉE UN ET ON L'ENTRE COMME RANK = 1
                await prismadb.collectionList.create({
                  data: {
                    ownId: metrics?.nois, // nois = next own id snippets
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  }
                })
                //
                await prismadb.collection.create({
                  data: {
                    ownId: metrics?.nois,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: 1, // le premier participant
                    rank: 1,  // son rang surnbre de participants
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // on select l'id qui vient d'être crée
                const theCollectionId = await prismadb.collection.findFirst({
                  where: { 
                    ownId: metrics?.nois,
                    googleEmail:connected?.googleEmail
                  }
                })
                // ON UPDATE LE NOIS DE +1
                if(metrics?.nois)
                {
                  await prismadb.metric.updateMany({
                    data: { nois: metrics?.nois + 1 }
                  })
                }
              }
            }
          }
          // ##### FIN TOP < BOTTOM ##### CHECK OK ##################################
        } 
        // ###### FIN 2 ########################################################

        // openCollectionCount > 2
        if( openCollectionCount > 2)
        {
          // on select le ownId de la collecte du bas dans collectionList
          const bottomInList = await prismadb.collectionList.findFirst({
            where: {
              amount: concernedAmount?.amount,
              isGroupComplete:false,
              collectionType: ctype
            },
            orderBy: { ownId: "desc"}
          })
          // on select la collecte d'en bas dans collection
          const bottomCollection = await prismadb.collection.findFirst({
            take: 1, // pour select le premier participant
            where: {
              ownId: bottomInList?.ownId,
              amount: concernedAmount?.amount,
              isGroupComplete:false,
              collectionType: ctype
            }
          })
          /* On select de manière croissante la 1ere collecte ayant le même nbre 
          de participants que la bottomCollection (qui peut être elle même,la bottomCollection) */
          const topFirst:any = await prismadb.collection.findFirst({
            take: 1, // pour select le premier participant
            where: {
              amount: concernedAmount?.amount,
              groupStatus: bottomCollection?.groupStatus, // même nbre de participants que dans la collecte du bas
              isGroupComplete:false,
              collectionType: ctype
            }
          })
          // on y ajoute le prochain participant
          if(topFirst)
          {
            // ON VÉRIFIE S'IL EST DEJÀ DEDANS
            const inTopFirstCount = await prismadb.collection.count({
              where: {
                ownId: topFirst?.ownId,
                amount: topFirst?.amount,
                collectionType: topFirst?.collectionType,
                googleEmail: connected?.googleEmail,
              }
            }) 
            if(inTopFirstCount < 1)
            {
              // on le rentre avec le un rank = topFirst?.groupStatus + 1
              await prismadb.collection.create({
                data: {
                  ownId: topFirst?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  groupStatus: topFirst?.groupStatus + 1, // nbre participants présent
                  rank: topFirst?.groupStatus + 1,  // son rang sur le nbre de participants
                  googleEmail: connected?.googleEmail,
                  usercodepin: connected?.usercodepin,
                  profileId: connected?.id
                }
              })
              // on select l'id qui vient d'être crée
              const theCollectionId = await prismadb.collection.findFirst({
                where: { 
                  ownId: topFirst?.ownId,
                  googleEmail:connected?.googleEmail
                }
              })
              // on update le groupStatus pour tous
              await prismadb.collection.updateMany({
                where: { 
                  ownId: topFirst?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype
                },
                data: { groupStatus: topFirst?.groupStatus + 1 }
              })
              // si le group est complet on met isgroupeComplete à true
              if( topFirst?.groupStatus + 1 === topFirst?.group )
              {
                // on update colectionList
                await prismadb.collectionList.updateMany({
                  where: {
                    ownId: topFirst?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
                // on update collection
                await prismadb.collection.updateMany({
                  where: {
                    ownId: topFirst?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: {
                    isGroupComplete: true
                  }
                })
              }
            } // TODO: PUIS LE BOTTOM AVANT D'EN CRÉER UN NOUVEAU
            else{ 
              // ON SELECT LA COLLECTTE QUI VIENT APRES TOPFIRST = TOPSECOND
              const topSecond:any = await prismadb.collection.findFirst({
                take: 1, // pour select le premier participant
                where: {
                  ownId: { gt: topFirst?.ownId },
                  amount: concernedAmount?.amount,
                  groupStatus: bottomCollection?.groupStatus, // même nbre de participants que dans la collecte du bas
                  isGroupComplete:false,
                  collectionType: ctype
                }
              })
              // ON VÉRIFIE S'IL EST DEJÀ DANS TOPSECOND
              const inTopSecondCount = await prismadb.collection.count({
                where: {
                  ownId: topSecond?.ownId,
                  amount: concernedAmount?.amount,
                  collectionType: ctype,
                  googleEmail: connected?.googleEmail,
                }
              }) 
              if(inTopSecondCount < 1)
              {
                // on le rentre avec le un rank = topSecond?.groupStatus + 1
                await prismadb.collection.create({
                  data: {
                    ownId: topSecond?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    groupStatus: topSecond?.groupStatus + 1, // nbre participants présent
                    rank: topSecond?.groupStatus + 1,  // son rang sur le nbre de participants
                    googleEmail: connected?.googleEmail,
                    usercodepin: connected?.usercodepin,
                    profileId: connected?.id
                  }
                })
                // on select l'id qui vient d'être crée
                const theCollectionId = await prismadb.collection.findFirst({
                  where: { 
                    ownId: topSecond?.ownId,
                    googleEmail:connected?.googleEmail
                  }
                })
                // on update le groupStatus pour tous
                await prismadb.collection.updateMany({
                  where: { 
                    ownId: topSecond?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype
                  },
                  data: { groupStatus: topSecond?.groupStatus + 1 }
                })
                // si le group est complet on met isgroupeComplete à true
                if( topSecond?.groupStatus + 1 === topSecond?.group )
                {
                  // on update colectionList
                  await prismadb.collectionList.updateMany({
                    where: {
                      ownId: topSecond?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    },
                    data: {
                      isGroupComplete: true
                    }
                  })
                  // on update collection
                  await prismadb.collection.updateMany({
                    where: {
                      ownId: topSecond?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    },
                    data: {
                      isGroupComplete: true
                    }
                  })
                }
              }
              else{
                // ON VA VERS LE BOTTOM COLLECTION ET ON VÉRIFIE S'IL EST DEJÀ DEDANS
                const inBottomCount = await prismadb.collection.count({
                  where: {
                    ownId: bottomCollection?.ownId,
                    amount: concernedAmount?.amount,
                    collectionType: ctype,
                    googleEmail: connected?.googleEmail,
                  }
                })
                if(bottomCollection && inBottomCount < 1)
                {
                  // on le rentre avec le un rank = bottomCollection?.groupStatus + 1
                  await prismadb.collection.create({
                    data: {
                      ownId: bottomCollection?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype,
                      groupStatus: bottomCollection?.groupStatus + 1, // nbre participants présent
                      rank: bottomCollection?.groupStatus + 1,  // son rang sur le nbre de participants
                      googleEmail: connected?.googleEmail,
                      usercodepin: connected?.usercodepin,
                      profileId: connected?.id
                    }
                  })
                  // on select l'id qui vient d'être crée
                  const theCollectionId = await prismadb.collection.findFirst({
                    where: { 
                      ownId: bottomCollection?.ownId,
                      googleEmail:connected?.googleEmail
                    }
                  })
                  // on update le groupStatus pour tous
                  await prismadb.collection.updateMany({
                    where: { 
                      ownId: bottomCollection?.ownId,
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    },
                    data: { groupStatus: bottomCollection?.groupStatus + 1 }
                  })
                  // si le group est complet on met isgroupeComplete à true
                  if( bottomCollection?.groupStatus + 1 === bottomCollection?.group )
                  {
                    // on update colectionList
                    await prismadb.collectionList.updateMany({
                      where: {
                        ownId: bottomCollection?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype
                      },
                      data: {
                        isGroupComplete: true
                      }
                    })
                    // on update collection
                    await prismadb.collection.updateMany({
                      where: {
                        ownId: bottomCollection?.ownId,
                        amount: concernedAmount?.amount,
                        collectionType: ctype
                      },
                      data: {
                        isGroupComplete: true
                      }
                    })
                  }
                } // S'IL EST DÉJÀ DANS LE BOTTOM, ON CRÉE UN NOUVEAU ET ON L'ENTRE
                else{
                  await prismadb.collectionList.create({
                    data: {
                      ownId: metrics?.nois, // nois = next own id snippets
                      amount: concernedAmount?.amount,
                      collectionType: ctype
                    }
                  })
                  //
                  await prismadb.collection.create({
                    data: {
                      ownId: metrics?.nois,
                      amount: concernedAmount?.amount,
                      collectionType: ctype,
                      groupStatus: 1, // le premier participant
                      rank: 1,  // son rang surnbre de participants
                      googleEmail: connected?.googleEmail,
                      usercodepin: connected?.usercodepin,
                      profileId: connected?.id
                    }
                  })
                  // on select l'id qui vient d'être crée
                  const theCollectionId = await prismadb.collection.findFirst({
                    where: { 
                      ownId: metrics?.nois,
                      googleEmail:connected?.googleEmail
                    }
                  })
                  // ON UPDATE LE NOIS DE +1
                  if(metrics?.nois)
                  {
                    await prismadb.metric.updateMany({
                      data: { nois: metrics?.nois + 1 }
                    })
                  }
                }
              } 
            }  
          }
        }
        // ##### FIN > 2 #######################################################
      }  
      //
    }
  //
  } catch (error) {
  // mettre ici l'erreur  
  }
  revalidatePath('/dashboard');
  redirect('/dashboard')
}
//
/*
*/
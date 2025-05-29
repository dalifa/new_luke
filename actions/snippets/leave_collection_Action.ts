'use server'

import { CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb'
import { revalidatePath } from 'next/cache';


/*
Quand un participant quitte une collecte, on met son profil 
dans CollectionParticipant a standBy == true et on diminu groupStatus dans collecte

on ne compte les participants que si standBy == false

on entre un participant là où il y a standBy == true et on augmente groupStatus

*/

export async function leaveCollectionAction({
  collectionId,
  participantId,
}: {
  collectionId: string,
  participantId: string,
}) {
  try {
    const connected = await CurrentProfile()
    // On select la collecte concernée
    const concernedCollection = await prismadb.collection.findFirst({
      where: {
        id: collectionId
      }
    }) 
    // On vérifie si le connecté en fait partie
    const exist = await prismadb.collectionParticipant.count({
      where: {
        collectionId,
        participantId: connected?.id
      }
    })
    if(exist === 1)
    {
      
      // On diminu de 1 participant le groupe si le groupe n'est pas complet
      if(concernedCollection && concernedCollection?.groupStatus !== concernedCollection?.group && concernedCollection?.groupStatus > 0){
        await prismadb.collection.updateMany({
          where: {
            id: collectionId,
          },
          data: {
            groupStatus: concernedCollection?.groupStatus - 1
          }
        })
      }
      // On met son onStandBy à true
      await prismadb.collectionParticipant.updateMany({
        where: {
          collectionId,
          participantId: connected?.id
        },
        data:{
          onStandBy: true  // ne peut plus être affiché ni accédé à cette collecte
        }
      })
      //
      revalidatePath("/dashboard")
      return { success: true }
    }
  } catch (error) {
    console.error('Erreur de sortie de la collecte', error)
    return { success: false, error }
  }
}


/* 
*/
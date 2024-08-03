"use server";

import { amountOne, currentUserInfos } from "@/hooks/own-current-user";
import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";  
import { redirect } from "next/navigation"; 

// AMOUNT ONe TOTALITY COLLECTION ENTER    
export const amountTwoEnterAction = async () => {
  const metrics = await prismadb.metric.findFirst() // en prod
  // Les profile data du connecté
  const connected = await currentUserInfos() // en prod
// Le montant One par default c'est 1€ ( pour le lancement )
const One = await amountOne()
  // 1- Vérifier s'il a du crédit et si son crédit est >= 1€
  if( connected?.credit && One?.amount && connected.credit >= One?.amount )
  {
    // 2- Verifier s'il est déjà dans une collecte ouverte ( isgroupcomplete = false ) de amountTwo
    const alreadyInCollectionCount = await prismadb.collection.count({
      where: {
        amount: One?.amount,
        currency: One?.currency,
        collectionType: "totality",
        email: connected.googleEmail,  // prod
        usercodepin: connected?.usercodepin,
        isGroupComplete: false
      }
    })
    // SI IL N'EST PAS DÉJÀ DANS UNE COLLECTE DE 1€
    if( alreadyInCollectionCount < 1 ) 
    {
      
    }
    else{
      console.log("déjà dans une collecte  isgroupComplete = false")
    }
  } // fin credit exist et >= a amount one ? 
  revalidatePath('/dashboard');
  redirect('/dashboard')
}

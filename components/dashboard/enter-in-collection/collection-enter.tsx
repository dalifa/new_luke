import { auth } from "@/auth";
import { prismadb } from "@/lib/prismadb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { amountFive, amountFour, amountOne, amountThree, currentUserInfos } from "@/hooks/own-current-user";
import { OneEuroDialog } from "./dialog-amount-buttons/one-euro";

export async function CollectionEnter() {
  //   
  const metrics = await prismadb.metric.findFirst()
  const connected = await currentUserInfos()
  //
  const One = await amountOne()
  const Two = await amountThree()
  const Three = await amountThree()
  const Four = await amountFour()
  const Five = await amountFive()
  // ############# TOTALITY ###########
  const inAmountOneCollection = await prismadb.collection.count({
    where: {
      amount: One?.amount,
      currency: One?.currency,
      collectionType: "totality",
      email: connected?.googleEmail,  // prod
      usercodepin: connected?.usercodepin,
      isGroupComplete: false
    }
    })
    // #### verifier s'il est déjà dans une collecte amount Two ouverte
    const inAmountTwoCollection = await prismadb.collection.count({
      where: {
        amount: Two?.amount,
        currency: Two?.currency,
        collectionType: "totality",
        email: connected?.googleEmail,  // prod
        usercodepin: connected?.usercodepin,
        isGroupComplete: false
      }
    })
    // #### verifier s'il est déjà dans une collecte amount three ouverte
    const inAmountThreeTotalityCollection = await prismadb.collection.count({
      where: {
        amount: Three?.amount,
        currency: Three?.currency,
        collectionType: "totality",
        email: connected?.googleEmail,  // prod
        usercodepin: connected?.usercodepin,
        isGroupComplete: false
      }
    })
    // #### verifier s'il est déjà dans une collecte amount four ouverte
    const inAmountFourCollection = await prismadb.collection.count({
      where: {
        amount: Four?.amount,
        currency: Four?.currency,
        collectionType: "totality",
        email: connected?.googleEmail,  // prod
        usercodepin: connected?.usercodepin,
        isGroupComplete: false
      }
    })
    // #### verifier s'il est déjà dans une collecte amount four ouverte
    const inAmountFiveCollection = await prismadb.collection.count({
        where: {
          amount: Five?.amount,
          currency: Five?.currency,
          collectionType: "totality",
          email: connected?.googleEmail,  // prod
          usercodepin: connected?.usercodepin,
          isGroupComplete: false
      }
    })
    // 
    return(
      <>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">  
          {
            // credit exist? and currency of amount one exist ? and credit >= than currency amount one ? =>
            connected?.credit && One?.amount && connected.credit >= One.amount ? (
              <div>
                {   // s'il n'est pas déjà dans une collecte dont le group n'est pas complet
                  inAmountOneCollection == 0 ? (
                    <OneEuroDialog/>
                  ):( // s'il est déjà dans une collecte dont group est ouvert
                      <Button variant={"blue"} disabled className="w-full">
                        {One?.amount}{One?.currency}
                      </Button>
                    )
                }
              </div>
            ):(
                <div>
                  <Button variant={"blue"} disabled className="w-full">
                    {One?.amount}{One?.currency}
                  </Button>
                </div>
              )
          }
          {/* end */}
        </div>
      </>
    )
}

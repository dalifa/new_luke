import { prismadb } from "@/lib/prismadb";
import { Card } from "@/components/ui/card";
import { currentUserInfos } from "@/hooks/own-current-user";
import { Button } from "../ui/button";
import Link from "next/link";
//import { AmountOneTriplEnter } from "./enter-in-collection/amountOne-triplEnter";

//
export async function CollectionEnter() {
  //   
  const connected = await currentUserInfos()
  // on select tous les montants
  const amounts:any = await prismadb.amount.findMany()
  // 
  return(
    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-800 text-md lg:text-lg'>
        Participer à un Tripl 
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">  
      {   
          amounts.map((amount:any) => (
            <>
            {
              amount?.amount > 1 && (
                <>
                {
                  connected?.credit >= amount?.amount ? (
                    <Link href={`/dashboard/enter-tripl-confirm/${amount?.id}`}>
                      <Button variant="primary" className=" w-full">{amount?.amount}€</Button>
                    </Link>
                  ):(
                      <Button disabled variant="primary">{amount?.amount}€</Button>
                    )
                }
                </>
              )
            }
            </>
          ))
      }
      </div>
  </Card>
  )
}
//

/*
<AlertDialog key={amount.id}>
                    <AlertDialogTrigger asChild>
                      {
                        connected?.credit >= amount?.amount ? (
                          <Button variant="primary">{amount?.amount}€</Button>
                        ):(
                          <Button disabled variant="primary">{amount?.amount}€</Button>
                        )
                      }
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-4/5 rounded-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-center mb-4">Participer à un Tripl</AlertDialogTitle>
                          <AlertDialogDescription className=" text-center text-black text-lg">
                            de &nbsp;<span>{amount.amount}€</span>
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <div className="w-full mt-4 flex flex-row items-center justify-around">
                          <AlertDialogCancel className="text-lg font-semibold px-10">
                            Annuler oh 
                          </AlertDialogCancel> 
                          
                          <AlertDialogAction className=" bg-white hover:bg-white">
                            {
                              // pour l'instant on ne prend pas 100€ en compte
                              amount?.amount !== 100 && (
                                <TriplEnter/>
                              )
                            }
                          </AlertDialogAction>
                          </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

*/
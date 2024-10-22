import { prismadb } from "@/lib/prismadb";
import { Card } from "@/components/ui/card";
import { currentUserInfos } from "@/hooks/own-current-user";
import Link from "next/link";
import { Button } from "@/components/ui/button";

//
export async function SnippetsCollectionEnter() {
  //   
  const connected = await currentUserInfos()
  // on select tous les montants
  const amounts:any = await prismadb.amount.findMany()
  // 
  return(
    <Card className='bg-white shadow-slate-300 shadow-lg p-4'>
      <p className='text-center mb-5 font-semibold text-slate-800 text-md lg:text-lg'>
        Participer à une collecte Snippets
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
                    <Link href={`/dashboard/enter-snippets-confirm/${amount?.id}`}>
                      <Button variant="violet" className=" w-full">{amount?.amount}€</Button>
                    </Link>
                  ):(
                      <Button disabled variant="violet">{amount?.amount}€</Button>
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
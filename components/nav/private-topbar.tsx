import { capitalize, CurrentProfile } from "@/hooks/own-current-user"
import BackButton from "./backButton"
import { PrivateSheet } from "./private-sheet"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircleUserRound, ShieldEllipsis } from "lucide-react"
import { auth } from "@/auth"
import { prismadb } from "@/lib/prismadb"

export async function PrivateTopbar() {
  const session = await auth()
  const connected = await CurrentProfile()
  //
  return (
    <div className="flex flex-col items-center justify-center fixed top-0 left-0 z-20 bg-indigo-600 text-white w-full h-16 border-b-2 border-indigo-400">
      <div className="flex flex-row w-full px-4 md:px-0 md:w-3/4 items-center justify-between">
        <div>
          <BackButton/>
        </div>
        <div>
          <Link href={"/"}>
            <h1 className="font-black  text-xl md:text-2xl shadow-sm">WE BLESS YOU</h1>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="hidden md:block">{connected && (capitalize(connected?.username)) }</p>
          { session && (
            <Link href={"/dashboard/profil"}>
              <Avatar className='h-7 w-7 border-white border-2'>
                <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-white">
                    <CircleUserRound className="text-blue-500 bg-white h-7 w-7" />
                  </AvatarFallback>
              </Avatar>
            </Link> 
          )}
          {/* {  
          // enlever User en Prod
            connected?.role === "ADMIN" || connected?.role === "USER" && ( */}
              <Link href={"/dashboard/admin"}>
                <ShieldEllipsis/>
              </Link>
          {/*  )}  */}
          <PrivateSheet/>
        </div>
      </div>
    </div>
  )
}

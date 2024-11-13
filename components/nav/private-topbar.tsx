import { capitalize, currentUserInfos } from "@/hooks/own-current-user"
import BackButton from "./backButton"
import { PrivateSheet } from "./private-sheet"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircleUserRound, ShieldEllipsis } from "lucide-react"
import { auth } from "@/auth"
import { prismadb } from "@/lib/prismadb"

export async function PrivateTopbar() {
  const session = await auth()
  const connected = await currentUserInfos()
  //
  return (
    <div className="flex flex-row fixed top-0 left-0 z-10 bg-blue-500 text-white w-full h-10 lg:h-14 items-center justify-between px-4 lg:px-8">
      <div>
        <BackButton/>
      </div>
      <div>
        <p>LUKE 6:38</p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <p>{connected && (capitalize(connected?.username)) }</p>
        { session && (
          <Link href={"/dashboard/profil"}>
            <Avatar className='h-7 w-7 border-white border-2'>
              <AvatarImage src={session?.user.image || ""} />
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
  )
}

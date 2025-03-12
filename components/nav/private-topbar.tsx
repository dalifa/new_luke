import { capitalize, CurrentProfile } from "@/hooks/own-current-user"
import BackButton from "./backButton"
import { PrivateSheet } from "./private-sheet"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CircleUserRound, LogOut, ShieldEllipsis } from "lucide-react"
import { auth } from "@/auth"
import { Button } from "../ui/button"

export async function PrivateTopbar() {
  const session = await auth()
  const connected = await CurrentProfile()
  // 
  return (
    <div className="flex flex-row items-center justify-center fixed top-0 left-0 z-20 bg-red-800 text-white w-full h-12 lg:h-14">
      <div className="flex flex-row w-full px-4 md:px-0 md:w-3/4 items-center justify-between">
        <div>
          <BackButton/>
        </div>
        <div>
          <Link href={"/"}>
            <h1 className="font-semibold">Tripl</h1>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="hidden md:block">{connected && (capitalize(connected?.username)) }</p>
          { session && (
            <Link href={"/dashboard/profil"}>
              <Avatar className='h-7 w-7 border-white border-2'>
                <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-white">
                    <CircleUserRound className="text-red-900 bg-white h-7 w-7" />
                  </AvatarFallback>
              </Avatar>
            </Link>
          )}
          {   
            connected?.role === "ADMIN" && (
              <Link href={"/dashboard/admin"}>
                <ShieldEllipsis/>
              </Link>
          )}
          <PrivateSheet/>
          <Link href={"/logout"}>
            <Button variant={"primary"} size={'sm'} className="text-white hover:bg-red-900">
              <LogOut className="text-white w-5 h-5"/>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Archive, BarChart4, LayoutDashboard, MenuIcon, UserRound } from "lucide-react"
import { Separator } from "../ui/separator"
import Link from "next/link"
import { CurrentProfile } from "@/hooks/own-current-user"

export async function PrivateSheet() {
  const connected = await CurrentProfile()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon className="cursor-pointer"/>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mt-4">
          <SheetTitle className="text-center text-blue-500">Menu</SheetTitle>
        </SheetHeader>
        <Separator/>
        <div className="grid gap-2 py-4">
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-blue-400">
            <Link href={"/dashboard"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <LayoutDashboard/> Dashboard
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-blue-400">
            <Link href={`/dashboard/profile/${connected?.id}`} className="text-slate-600">
              <div className="flex flex-row gap-5">
                <UserRound/> Profile
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-blue-400">
            <Link href={"/dashboard/historique"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <Archive/> Historique
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-blue-400">
            <Link href={"/dashboard/stats"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <BarChart4/> Stats
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="mt-10 bg-blue-500 rounded-md hover:bg-blue-400 p-2">
            <Link href={"/logout"} className="text-center text-white ">
              <p>Déconnexion</p>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

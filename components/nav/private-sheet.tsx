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
        <div className="p-2 rounded-md bg-indigo-400 hover:bg-white hover:text-indigo-600">
          <MenuIcon className="cursor-pointer"/>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mt-4">
          <SheetTitle className="text-center text-indigo-400">Menu</SheetTitle>
        </SheetHeader>
        <Separator/>
        <div className="grid gap-2 py-4">
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-indigo-400">
            <Link href={"/dashboard"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <LayoutDashboard className="text-indigo-600"/> Dashboard
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-indigo-400">
            <Link href={`/dashboard/profile/${connected?.id}`} className="text-slate-600">
              <div className="flex flex-row gap-5">
                <UserRound className="text-indigo-600"/> Profile
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-indigo-400">
            <Link href={"/dashboard/historique"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <Archive className="text-indigo-600"/> Historique
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-indigo-400">
            <Link href={"/dashboard/stats"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <BarChart4 className="text-indigo-600"/> Stats
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="mt-10 bg-indigo-600 rounded-md hover:bg-indigo-400 p-2">
            <Link href={"/logout"} className="text-center text-white ">
              <p>Déconnexion</p>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

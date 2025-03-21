import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Archive, ArrowLeftRight, BarChart4, LayoutDashboard, MenuIcon, UserRound } from "lucide-react"
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
          <SheetTitle className="text-center text-red-800">Menu</SheetTitle>
        </SheetHeader>
        <Separator/>
        <div className="grid gap-2 py-4">
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-red-900">
            <Link href={"/dashboard"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <LayoutDashboard/> Dashboard
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-red-900">
            <Link href={`/dashboard/profile/${connected?.id}`} className="text-slate-600">
              <div className="flex flex-row gap-5">
                <UserRound/> Profile
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-red-900">
            <Link href={"/dashboard/historique"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <Archive/> Historique
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-red-900">
            <Link href={"/dashboard/profile/transfert"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <ArrowLeftRight/> Transfert
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-red-900">
            <Link href={"/dashboard/stats"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <BarChart4 className="text-red-800"/> Stats
              </div>
            </Link>
          </SheetClose>
          <SheetClose asChild className="mt-10 bg-red-800 rounded-md hover:bg-red-900 p-2">
            <Link href={"/logout"} className="text-center text-white ">
              <p>Déconnexion</p>
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

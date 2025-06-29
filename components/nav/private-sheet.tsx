import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Archive, BarChart4, CircleUserRound, LayoutDashboard, MenuIcon, UserRound, UserRoundPlus, UserRoundSearch } from "lucide-react"
import { Separator } from "../ui/separator"
import Link from "next/link"
import { CurrentProfile } from "@/hooks/own-current-user"
import { prismadb } from "@/lib/prismadb"

export async function PrivateSheet() {
  const connected = await CurrentProfile()
  // pour la période BETA TEST
  const parrainageCount = await prismadb.sponsorship.count({
    where: {hashedEmail: connected?.hashedEmail}
  })
  //
  const godChildren = await prismadb.sponsorship.findMany({
    where: { parrainId: connected?.id }
  }) 
  //
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
        {/* enlever la condition à la fin du BETA TEST */}
        { parrainageCount !== 0 && ( 
         <>
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
            <Link href={"/dashboard/parrainage"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <UserRoundPlus className="text-indigo-600"/> Parrainage
              </div>
            </Link>
          </SheetClose>
          {
            godChildren && (
            <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-indigo-400">
              <Link href={"/dashboard/filleuls"} className="text-slate-600">
                <div className="flex flex-row gap-5 ">
                  <CircleUserRound className="text-indigo-600"/> Filleuls
                </div>
              </Link>
            </SheetClose>
            )
          }
          <SheetClose asChild className="p-2 border rounded-md hover:text-white hover:bg-indigo-400">
            <Link href={"/dashboard/retrouver"} className="text-slate-600">
              <div className="flex flex-row gap-5 ">
                <UserRoundSearch className="text-indigo-600"/> Retrouver
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
          </>)} {/* enlever à la fin du BETA TEST */}
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

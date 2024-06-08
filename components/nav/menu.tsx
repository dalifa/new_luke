import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Archive, ArrowRightLeft, Group, LayoutDashboard, LineChart, MenuIcon, Shield, ShieldCheck, ShieldPlus, UserCircle, UserCircle2 } from "lucide-react"
import SignOut from "@/components/auth/sign-out"
import { auth, signOut } from "@/auth"
import { prismadb } from "@/lib/prismadb"
import Link from "next/link"
import { connectedAmountOne, connectedAmountThree, connectedAmountTwo, currentUserInfos, } from "@/hooks/own-current-user"

export async function Menu() {
  const connectedUser = await currentUserInfos()
  //
  const myAmountOne = await connectedAmountOne()
  const myAmountTwo = await connectedAmountTwo()
  const myAmountThree = await connectedAmountThree()
  //
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:bg-blue-600">
        <div className="p-1 rounded">
            <MenuIcon className="cursor-pointer"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 mr-2 bg-white p-2">
        <DropdownMenuLabel className="text-slate-500">Menu</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-300"/>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={"/dashboard"} 
            className="flex items-center flex-row gap-x-2
            text-slate-500 hover:text-blue-600"
            >
                <LayoutDashboard className="w-5 h-5"/>
                <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/dashboard/profil"} 
            className="flex items-center flex-row gap-x-2
            text-slate-500 hover:text-blue-600"
            >
                <UserCircle2 className="w-5 h-5"/>
                <span>Profil</span>
            </Link>
          </DropdownMenuItem>
          <div>
          {
            // si le jackpot existe et est > au 3è montant selon la monnaie du connecté: alors ...TRANSFERT POSSIBLE
            connectedUser && myAmountThree && connectedUser.jackpot > myAmountThree?.amount ? (
              <DropdownMenuItem>
                <Link href={"/dashboard/transfert"} 
                className="flex items-center flex-row gap-x-2
                text-slate-500 hover:text-blue-600"
                >
                  <ArrowRightLeft className="w-5 h-5"/>
                  <span>Transfert</span>
                </Link>
              </DropdownMenuItem>
            ):("")
          }
          </div>
          <DropdownMenuItem>
            <Link href={"/dashboard/historique"} 
                className="flex items-center flex-row gap-x-2
                text-slate-500 hover:text-blue-600"
                >
                <Archive className="w-5 h-5"/>
                <span>Historique</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <div>
            {
                connectedUser?.role !== "USER" && (
                    <>
                    <DropdownMenuSeparator className="bg-slate-300"/>
                    <DropdownMenuItem></DropdownMenuItem>
                    </>
                )
            }
            {
                connectedUser?.isPartner === true && (
                    <DropdownMenuItem>
                        <Link href={"/dashboard/partenariat"} 
                            className="flex items-center flex-row gap-x-2
                           text-slate-500 hover:text-blue-600"
                        >
                            <ShieldCheck className="w-5 h-5"/>
                            <span>Partenariat</span>
                        </Link>
                    </DropdownMenuItem>
                )
            }
            {
                connectedUser?.role === "ADMIN" && (
                    <>
                    <DropdownMenuItem>
                        <Link href={"/dashboard/admin"} 
                            className="flex items-center flex-row gap-x-2
                          text-slate-500 hover:text-blue-600"
                        >
                            <ShieldPlus className="w-5 h-5"/>
                            <span>Admin</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={"/dashboard/stats"} 
                            className="flex items-center flex-row gap-x-2
                            text-slate-500 hover:text-blue-600"
                        >
                            <LineChart className="w-5 h-5"/>
                            <span>Admin Stats</span>
                        </Link>
                    </DropdownMenuItem>
                    </>
                )
            }
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* <SignOut/>   */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

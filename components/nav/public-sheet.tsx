"use client"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { BarChart4, FileText, Handshake, Home, Info, MenuIcon, Settings, ShieldBan, ShieldQuestion } from "lucide-react"
import Link from "next/link"
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LogGoogleButton } from "../auth/log-google-button"

export function PublicSheet() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const active = pathname
  //
  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) {
    return null;
  }
  return (
    <>
    <MenuIcon className="cursor-pointer text-white" onClick={onOpen}/>
    
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="pt-14">
        <SheetTitle className="hidden"></SheetTitle>
        <div className="h-full flex flex-col items-start gap-3 px-2 py-4 bg-neutral-100 rounded-sm">
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/home"}>
              <div className="flex flex-row items-center gap-2">
                <Home/>
                <p>Accueil</p>
              </div>
            </Link>
          </SheetClose>  
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/ccm"}>
              <div className="flex flex-row items-center gap-2">
                <Settings/>
                <p className="hidden lg:flex">Comment ça marche</p>
                <p className="flex lg:hidden">
                  Cçm
                </p>
              </div>
            </Link>
          </SheetClose>  
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/faq"}>
              <div className="flex flex-row items-center gap-2">
                <ShieldQuestion/>
                <p className="hidden lg:flex">Questions fréquemment posées</p>
                <p className="flex lg:hidden">
                  Faq
                </p>
              </div>
            </Link>
          </SheetClose>
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/infos"}>
              <div className="flex flex-row items-center gap-2">
                <Info/>
                <p>Infos légales</p>
              </div>
            </Link>
          </SheetClose>
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/cgu"}>
            <div className="flex flex-row items-center gap-2">
                <FileText/>
                <p className="hidden lg:flex">Conditions générales d&apos;utilisation</p>
                <p className="flex lg:hidden">
                  Cgu
                </p>
              </div>
            </Link>
          </SheetClose>
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/partenariat"}>
              <div className="flex flex-row items-center gap-2">
                <Handshake/>
                <p>Partenariat</p>
              </div>
            </Link>
          </SheetClose>
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/securite"}>
            <div className="flex flex-row items-center gap-2">
                <ShieldBan/>
                <p>
                  <span className=" flex lg:hidden">Confidentialité</span>
                  <span className="hidden lg:flex">sécurité et confidentialité</span>
                </p>
              </div>
            </Link>
          </SheetClose>
          <SheetClose className="bg-neutral-100 hover:bg-blue-300 hover:text-black hover:font-medium rounded-md text-neutral-500 w-full p-2">
            <Link href={"/stats"}>
              <div className="flex flex-row items-center gap-2">
                <BarChart4/>
                <p>Stats</p>
              </div>
            </Link>
          </SheetClose>

          <div className="bottom-0 mx-auto">
            <LogGoogleButton/>
          </div>
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}


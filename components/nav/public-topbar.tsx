"use client"
import Link from "next/link"
import BackButton from "./backButton"
import { PublicSheet } from "./public-sheet"
import { NavLogButton } from "../auth/public-nav-logbutton"
import { usePathname } from "next/navigation"

const PublicTopbar = () => {
  const pathname = usePathname()
  //
  return (
    <div className="flex flex-col items-center justify-center fixed top-0 left-0 z-20 bg-indigo-600 text-white w-full h-16 border-b-2 border-indigo-400">
      <div className="flex flex-row w-full px-2 md:px-0 md:w-3/4 items-center justify-between">
        <div>
          <BackButton/> 
        </div>
        <div className="flex flex-col items-center">
          <Link href={"/"}>
            <h1 className="font-black  text-xl md:text-2xl shadow-sm">WE BLESS YOU</h1>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          {/* <NavLogButton/> */}
          <PublicSheet/>
        </div>
      </div>
    </div>
  )
}

export default PublicTopbar

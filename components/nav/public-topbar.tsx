import Link from "next/link"
import BackButton from "./backButton"
import { PublicSheet } from "./public-sheet"
import { NavLogButton } from "../auth/public-nav-logbutton"

const PublicTopbar = () => {

  return (
    <div className="flex flex-row items-center justify-center fixed top-0 left-0 z-20 bg-blue-500 text-white w-full h-12 lg:h-14">
      <div className="flex flex-row w-full px-4 md:px-0 md:w-3/4 items-center justify-between">
        <div>
          <BackButton/>
        </div>
        <div>
          <Link href={"/"}>
          <h1 className="font-semibold">WE BLESS YOU</h1>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <NavLogButton/>
          <PublicSheet/>
        </div>
      </div>
    </div>
  )
}

export default PublicTopbar

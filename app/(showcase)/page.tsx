import { Button } from "@/components/ui/button"
import { BookOpenText } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="h-full items-center justify-center flex-col bg-blue-800 text-white">
      <div className="flex items-center justify-center flex-col gap-y-10">
        <div className="flex w-4/5 md:w-3/5 items-center justify-center flex-row gap-x-5 mt-[15%] md:mt-[5%] text-2xl md:text-3xl font-bold mb-0 md:mb-5 lg:mb-10">
          <BookOpenText/>
          <h1>LUKE 6:38</h1>
        </div>
        <div className="flex w-4/5 md:w-3/5 flex-col">
          <p className=" text-md md:text-2xl text-justify leading-loose mb-2">Donnez aux autres et Dieu vous donnera (à travers les autres): on
          versera dans la grande poche de votre vêtement une bonne mesure, bien serrée et secouée, débordante.<br/>
          Dieu mesurera ses dons envers vous avec la mesure même que vous employez pour les autres.</p>
          <p className="text-sm text-end"><em>Bible Français courant</em></p>
        </div>
        <div className="flex w-4/5 md:w-3/5 items-center justify-center">
          <p className="text-md md:text-2xl text-justify font-semibold">A cette affirmation du Seigneur Jésus, dites-vous amen ?</p>
        </div>
        <div className="flex w-4/5 md:w-3/5 items-center justify-center mt-0 md:mt-3 lg:mt-5">
          <Link href={"/home"} className="w-full text-center">
            <Button variant="blue" className="w-3/5 h-14 text-xl md:text-2xl font-semibold border-2 border-white">
              AMEN !
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

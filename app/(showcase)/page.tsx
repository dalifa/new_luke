import { Button } from "@/components/ui/button"
import { BookOpenText } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex w-full h-full items-center justify-center flex-col bg-blue-800 text-white p-4 md:p-5">
      <div className="flex w-full md:w-4/5 items-center justify-center flex-col">
        <div className="flex items-center gap-x-2 mb-5 md:mb-10 text-lg md:text-3xl font-semibold">
          <BookOpenText className="h-6 w-6 md:h-8 md:w-8"/>
          <h1>LUKE 6:38</h1>
        </div>
        <div className="flex flex-col">
          <p className="text-md md:text-2xl text-justify leading-relaxed mb-2">Donnez aux autres et Dieu vous donnera (à travers les autres): on
          versera dans la grande poche de votre vêtement une bonne mesure, bien serrée et secouée, débordante.<br/>
          Dieu mesurera ses dons envers vous avec la mesure même que vous employez pour les autres.</p>
          <p className="text-sm text-end"><em className="text-xs md:text-sm">Bible Français courant</em></p>
        </div>
        <div className="flex items-center justify-center mt-5">
          <p className="text-md md:text-2xl text-justify font-semibold">
            A cette affirmation du Seigneur Jésus, dites-vous amen ?
          </p>
        </div>
        <div className="flex w-full items-center justify-center mt-5 lg:mt-5">
          <Link href={"/home"} className="w-4/5 lg:w-3/5 text-center">
            <Button variant="blue" className="w-full h-10 lg:h-14 text-md md:text-xl font-semibold border-2 border-white">
              AMEN !
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

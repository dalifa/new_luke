import { Card } from "@/components/ui/card"
import { AlertOctagon, BarChart, BarChart3, BookOpenCheck, HeartHandshake, HelpCircle, School2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import wallpaper3 from '@/public/assets/images/wallpaper3.jpg'

const Infos = () => { 
  return ( 
    <main className="flex flex-col w-full items-center justify-between"> 
      <div className='relative w-full'> 
        <div className="absolute w-full -z-10"> 
          <Image src={wallpaper3} alt='bg-image' className='w-full h-screen' width={1000} height={1000}/>
        </div> 
        <div className="max-w-screen-lg m-auto h-[100vh] py-28 px-5 text-center bg-transparent">
          <div className="w-full md:w-4/5 m-auto">
            <div className="grid grid-cols-2 w-full lg:pb-20 gap-4 text-slate-700">
              <Link href={"/faq"}>
                <Card className="flex flex-col items-center justify-center gap-2 bg-white font-semibold shadow-lg p-4">
                  <p><HelpCircle/></p>
                  <p className="text-sm lg:text-lg">Questions fréqemment posées</p>
                </Card>
              </Link>
              <Link href={"/cgu"}>
                <Card className="flex flex-col items-center justify-center gap-2 bg-white font-semibold shadow-lg p-4">
                  <p><BookOpenCheck/></p>
                  <p className="text-sm lg:text-lg">Conditions générales d&apos;utilisation</p>
                </Card>
              </Link>
              <Link href={"/infos-legales"}>
                <Card className="flex flex-col items-center justify-center gap-2 bg-white font-semibold shadow-lg p-4">
                 <p><AlertOctagon/></p>
                 <p className="text-sm lg:text-lg">Informations legales</p>
                </Card>
              </Link>
              <Link href={"/partenariat"}>
                <Card className="flex flex-col items-center justify-center gap-2 bg-white font-semibold shadow-lg p-4">
                  <p><HeartHandshake/></p>
                  <p className="text-sm lg:text-lg">Devenir notre partenaire</p>
                </Card>
              </Link>
              <Link href={"/entreprises-partenaires"}>
                <Card className="flex flex-col items-center justify-center gap-2 bg-white font-semibold shadow-lg p-4">
                  <p><School2/></p>
                  <p className="text-sm lg:text-lg">Entreprises partenaires</p>
                </Card>
              </Link>
              <Link href={"/nos-stats"}>
                <Card className="flex flex-col items-center justify-center gap-2 bg-white font-semibold shadow-lg p-4">
                  <p><BarChart3/></p>
                  <p className="text-sm lg:text-lg">Toutes nos Statistiques</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main> 
  )
}

export default Infos




import { Card } from "@/components/ui/card"
import { AlertOctagon, BarChart, BarChart3, BookOpenCheck, HeartHandshake, HelpCircle, School2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import wallpaper3 from '@/public/assets/images/wallpaper3.jpg'

const Infos = () => { 
  return ( 
    <div className="w-full h-screen flex flex-col items-center  px-4 md:px-20 py-14 bg-indigo-600">
      <div className='my-10 md:my-14 border-4 border-indigo-400 text-xl text-white rounded-lg py-4 px-2 md:px-10'>
        <p>We Bless You</p>
        <p>Plateforme chrétienne de don participatif direct et circulaire.</p><br/>

        <p>Site déployé sur Vercel</p><br/>

        <p>Base de donné sur MongoDB servers en Belgique</p><br/>
        <p>Directeur de la publication: Lionel DAMBA</p>
        <p>weblessyou.com@gmail.com</p>
        <p>sise à Crégy-Lès-Meaux</p>
      </div>
    </div>
  )
}

export default Infos




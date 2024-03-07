import { Button } from '@/components/ui/button'
import { Gift } from 'lucide-react'
import { SlLogin } from "react-icons/sl";
import Link from 'next/link'
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import wallpaper1 from '@/public/assets/images/wallpaper1.jpg'

const Home = () => {
  return (
    <main className="flex flex-col w-full items-center justify-between"> 
      <div className='relative w-full'> 
        <div className="absolute w-full -z-10"> 
          <Image src={wallpaper1} alt='bg-image' className='w-full h-screen' width={1000} height={1000}/>
        </div> 
        <div className="max-w-screen-lg m-auto h-[100vh] py-28 px-5 bg-transparent">
          <div className="max-w-7xl lg:mx-auto p-5 md:px-10 xl:px-0 w-full my-4 flex flex-col gap-8 md:gap-12">
            <h1 className="text-white font-bold text-[28px] leading-[48px] lg:text-[42px] lg:leading-[60px]  xl:text-[58px] xl:leading-[74px]">
              Luke 6:38, La plateforme de la générosité entre chrétiens.
            </h1>
            <p className="text-justify text-white text-[20px] font-normal leading-[24px] tracking-[2%] md:text-[24px] md:leading-[36px]">
              Imaginez un espace où toutes vos courses, vos shoppings, vos factures etc... peuvent généreusement
              être financés par la communauté.
            </p>
              <Button size="lg" asChild className="rounded-full h-[54px] text-sm lg:text-lg font-semibold leading-[24px] w-full sm:w-fit bg-blue-600 text-white hover:bg-white hover:text-blue-800">
                <Link href="/connexion-inscription">
                  Rejoignez la communauté
                </Link>
              </Button>
          </div>
          {/* section 1 */}
          <div className="max-w-7xl lg:mx-auto p-5 md:px-10 xl:px-0 w-full my-4 flex flex-col gap-8 md:gap-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600 font-semibold text-xl lg:text-2xl">
              <Card className='bg-white p-10 shadow-md '>
                Je rejoint un groupe de généreux
              </Card>
              <Card className='bg-white p-10 shadow-md'>
                Je finance le projet d'un autre membre
              </Card>
              <Card className='bg-white p-10 shadow-md'>
                Mon projet est, le cas échéant financé.
              </Card>
            </div>
          </div>
          {/* section 2 */}
          <div className="max-w-7xl lg:mx-auto p-5 md:px-10 xl:px-0 w-full my-4 flex flex-col gap-8 md:gap-12">
            <div className='bg-white text-blue-800 text-2xl font-bold text-center p-3 rounded-full'>
              Nos chiffres
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 text-xl lg:text-2xl font-semibold text-slate-600">
              <Card className=' bg-white p-10 shadow-lg'>
                100K généreux ont déjà rejoint la communauté.
              </Card>
              <Card className='bg-white p-10 shadow-lg'>
                45K Collectes ont déjà étés réalisées.
              </Card>
              <Card className='bg-white p-10 shadow-lg'>
                7M d&apos;euros ont déjà étés donnés.
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home

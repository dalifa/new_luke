import { Button } from '@/components/ui/button'
import { Gift, UserRound } from 'lucide-react'
import { SlLogin } from "react-icons/sl";
import Link from 'next/link'
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import wallpaper1 from '@/public/assets/images/wallpaper1.jpg'
import { GrCurrency, GrGift, GrGroup } from 'react-icons/gr';

const Home = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center pt-5 bg-white"> 
      <div className="w-4/5 space-y-10 mt-5">
          <div>
            <h1 className="text-center mt-10 lg:mt-20 text-slate-600 font-bold text-2xl md:text-3xl lg:text-4xl">
              La générosité entre chrétiens.
            </h1>
          </div>  
          <div>
            <p className="text-center text-slate-500 text-xl md:text-2xl font-normal leading-loose">
              Financez, et faites financer une de vos dépenses généreusement
              par votre grande famille chrétienne.
            </p>
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-row items-center justify-center border-2 border-slate-200 rounded p-2 text-blue-500'>
              <UserRound className='w-10 h-10 lg:w-14 lg:h-14'/>
            </div>
            <div className='flex flex-row items-center justify-center border-2 border-slate-200 rounded p-2 md:py-5 text-blue-500'>
              <Gift className='w-10 h-10 lg:w-14 lg:h-14'/>
            </div>
            <div className='flex flex-row items-center justify-center border-2 border-slate-200 rounded p-2 md:py-5 text-blue-500'>
              <UserRound className='w-10 h-10 lg:w-14 lg:h-14'/>
            </div>
            <div>
              <p className='text-white'>vide</p>
            </div>
            <div className='flex flex-row items-center justify-center border-2 border-slate-200 rounded p-2 md:py-5 text-blue-500'>
                <UserRound className='w-10 h-10 lg:w-14 lg:h-14'/>
            </div>
            <div>
              <p className='text-white'>vide</p>
            </div>
          </div>
          <div className='flex flex-row w-full items-center justify-center'>
            <Button size="lg" asChild className="rounded-full h-[54px] text-md lg:text-xl font-semibold leading-[24px] w-full sm:w-fit bg-blue-500 text-white hover:bg-blue-600 px-4">
              <Link href="/connexion-inscription">
                Rejoignez la communauté
              </Link>
            </Button>
          </div>
      </div>
    </div>
  )
}

export default Home

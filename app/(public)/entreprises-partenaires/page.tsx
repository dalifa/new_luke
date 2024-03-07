import { Card } from '@/components/ui/card'
import Image from 'next/image'
import wallpaper17 from '@/public/assets/images/wallpaper17.jpg'
import BackButton from '@/components/nav/backButton'

const Ccm = () => {
    return (
        <div className='relative flex w-full items-center flex-col pb-20 px-2'>
            <div className='absolute -z-10 w-full'>
                <Image
                  src={wallpaper17} alt='bg-image' className='w-full' width={1000} height={1000}
                />
            </div>
            <Card className='flex flex-col w-full lg:w-4/5 gap-y-5 overflow-auto mt-48 p-5 lg:p-10 pb-10 lg:pb-24 bg-white leading-relaxed text-justify'>
            <div className='flex flex-row items-start justify-between gap-x-5 text-blue-800'>
                <div className='border-[1px] rounded-md border-blue-800 hover:text-white hover:bg-blue-800'>
                  <BackButton/>
                </div>
                <div className=''>
                  <h1 className='text-lg lg:text-2xl font-semibold'>
                    Entreprises Partenaires
                  </h1>
                </div>
              </div>
                <div>
                    <h1 className='text-center lg:text-left text-xl lg:text-2xl font-semibold my-2 text-blue-800'>
                        Notre cible
                    </h1>
                    <p className='text-md lg:text-lg font-normal'>
                        Cette plateforme s&apos;adresse
                    </p>
                </div>
                <div>
                    <h1 className='text-center lg:text-left text-xl lg:text-2xl font-semibold my-2 text-blue-800'>
                        Comment ça marche
                    </h1>
                    
                </div>
            </Card>
        </div>
    )
}

export default Ccm

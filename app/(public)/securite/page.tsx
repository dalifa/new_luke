import { Card } from '@/components/ui/card'
import BackButton from '@/components/nav/backButton'

const Ccm = () => {
    return ( 
        <div className='relative flex w-full items-center flex-col pb-20 px-2'>
            <Card className='flex flex-col w-full lg:w-4/5 gap-y-5 overflow-auto mt-48 p-5 lg:p-10 pb-10 lg:pb-24 bg-white leading-relaxed text-justify'>
            <div className='flex flex-row items-start justify-between gap-x-5 text-red-800'>
                <div className='border-[1px] rounded-md border-red-800 hover:text-white hover:bg-red-900'>
                  <BackButton/>
                </div>
                <div className=''>
                  <h1 className='text-lg lg:text-2xl font-semibold'>
                    Nos statistiques
                  </h1>
                </div>
              </div>
                <div>
                    <h1 className='lg:text-left text-xl lg:text-2xl font-semibold my-2 text-red-800'> 
                        Notre cible
                    </h1>
                    <p className='text-md lg:text-lg font-normal'>
                        Cette plateforme s&apos;adresse
                    </p>
                </div>
                <div>
                    <h1 className='lg:text-left text-xl lg:text-2xl font-semibold my-2 text-red-800'>
                        Comment ça marche
                    </h1>
                    
                </div>
            </Card>
        </div>
    )
}

export default Ccm

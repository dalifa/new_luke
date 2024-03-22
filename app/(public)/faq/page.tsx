import { Card } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import Image from 'next/image'
import wallpaper13 from '@/public/assets/images/wallpaper13.jpg'
import BackButton from '@/components/nav/backButton'

const Faq = () => {
  return (
    <div className='relative flex w-full items-center flex-col pb-20 px-2'>
            <div className='absolute -z-10 w-full'>
                <Image
                  src={wallpaper13} alt='bg-image' className='w-full' width={1000} height={1000}
                />
            </div>
            <Card className='flex flex-col w-full lg:w-4/5 gap-y-5 overflow-auto mt-48 p-5 lg:p-10 pb-10 lg:pb-24 bg-white leading-relaxed text-justify shadow-lg shadow-slate-300'>
              <div className='flex flex-row items-start justify-between gap-x-5 text-blue-800'>
                <div className='border-[1px] rounded-md border-blue-800 hover:text-white hover:bg-blue-800'>
                  <BackButton/>
                </div>
                <div className=''>
                  <h1 className='text-lg lg:text-2xl font-semibold'>
                    Questions fréquemment posées
                  </h1>
                </div>
              </div>
              <div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Question 1?</AccordionTrigger>
                    <AccordionContent>
                      j'ai crée la branch lukebranch il faut rendre cette branche principale ?;
                    </AccordionContent>
                  </AccordionItem>
                  {/* 2 */}
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                    New Luke marche, après avoir fait quelques vérif, je depoie.
                    
                    </AccordionContent>
                  </AccordionItem>
                  {/* 3 */}
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It&apos;s animated by default, but you can disable it if you
                      prefer.
                    </AccordionContent>
                  </AccordionItem>
                  {/* 4 */}
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It&apos;s animated by default, but you can disable it if you
                      prefer.
                    </AccordionContent>
                  </AccordionItem>
                  {/* 5 */}
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It&apos;s animated by default, but you can disable it if you
                      prefer.
                    </AccordionContent>
                  </AccordionItem>
                  {/* 6 */}
                  <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
            {/* 7 */}
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </div>
  )
}

export default Faq

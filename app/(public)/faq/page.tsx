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
            <Card className='flex flex-col w-full lg:w-4/5 gap-y-5 overflow-auto mt-48 p-5 lg:p-10 pb-10 lg:pb-24 bg-white leading-relaxed text-justify shadow-lg shadow-slate-300'>
              <div className='flex flex-row items-start justify-between gap-x-5 text-blue-500'>
                <div className='border-[1px] rounded-md border-blue-500 hover:text-white hover:bg-blue-500'>
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
                      reponse une
                    </AccordionContent>
                  </AccordionItem>
                  {/* 2 */}
                  <AccordionItem value="item-2">
                    <AccordionTrigger>question 2?</AccordionTrigger>
                    <AccordionContent>
                      reponse deux
                    </AccordionContent>
                  </AccordionItem> 
                  {/* 3 */}
                  <AccordionItem value="item-3">
                    <AccordionTrigger>question 3?</AccordionTrigger>
                    <AccordionContent>
                      reponse trois
                    </AccordionContent>
                  </AccordionItem>
                  {/* 4 */}
                  <AccordionItem value="item-3">
                    <AccordionTrigger>question 4?</AccordionTrigger>
                    <AccordionContent>
                      reponse quatre
                    </AccordionContent>
                  </AccordionItem>
                  {/* 5 */}
                  <AccordionItem value="item-3">
                    <AccordionTrigger>question 5?</AccordionTrigger>
                    <AccordionContent>
                      reponse cinq
                    </AccordionContent>
                  </AccordionItem>
                  {/* 6 */}
                  <AccordionItem value="item-3">
                  <AccordionTrigger>question 6?</AccordionTrigger>
              <AccordionContent>
                reponse six
              </AccordionContent>
            </AccordionItem>
            {/* 7 */}
            <AccordionItem value="item-3">
              <AccordionTrigger>question 7?</AccordionTrigger>
              <AccordionContent>
                reponse sept
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </div>
  )
}

export default Faq

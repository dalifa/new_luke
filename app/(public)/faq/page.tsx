import { Card } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
//
const Faq = () => {
  return (
    <div className=" w-full flex flex-col items-center  px-4 md:px-20 py-14">
      <div className='my-10 md:my-14 bg-indigo-200 rounded-lg py-4 px-2 md:px-10'>
        <h1 className='text-center text-2xl md:text-3xl font-semibold text-indigo-600'>
          Questions fréquemments posées
        </h1>
      </div>
      <div className='w-full md:w-4/5 flex flex-col items-center bg-indigo-200 rounded-lg p-4 md:p-10'>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Cette plateforme est pour qui ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              WE BLESS YOU est une plateforme qui s&apos;adresse à tout enfant de Dieu né de nouveau.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Pourquoi donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              <span>Luc 6:38 nous dit: Donnez et il vous sera donné...</span>
              <span>et Proverbes 11:25: une personne généreuse sera comblée de biens en retour,...</span>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Combien donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Nous vous permettrons de donner librement entre 5€, 10€, 20€, 50€, 100€ et 200€.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              A qui donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              A tout enfant de Dieu, qui aura lui-même déjà donné le montant que vous aurez choisi de lui donner.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Comment donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Une fois que vous aurez choisi votre destinataire, vous aurez accès à ses coordonnées. 
              vous lui ferez un transfert par numéro de portable via Wero, Lydia ou votre App Bancaire.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Comment recevoir?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Vous n&apos;aurez rien à faire, votre banque vous informera forcement de la reception d&apos;un transfert.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Comment savoir qu&apos;un transfert vient de WBY ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Un numéro unique dit <span className='font-semibold'>Donation Number</span> est 
              généré au donateur quand il vous choisi, il entre ce numéro sous le format 
              (exemple: WBY-2954) dans le libellé du transfert, et vous l&apos;envoie aussi 
              par SMS, afin que vous le voyez dans l&apos;historique du transfert reçu, et 
              l&apos;utilisez ensuite pour confirmer la reception du transfert.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Peut-on donner plusieurs fois à la même personne ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Non, une personne que vous avez déjà béni ou qui vous a déjà béni, ne peut pas 
              apparaître sur votre liste de personnes à bénir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Question 1?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              reponse une
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger className='text-start text-2xl font-semibold text-indigo-600'>
              Question 1?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              reponse une
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div> 
  )
}
//
export default Faq

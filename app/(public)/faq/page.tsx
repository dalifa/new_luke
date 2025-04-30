//
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
//
const Faq = () => {
  return (
    <div className=" w-full flex flex-col items-center  px-4 md:px-20 py-14 bg-indigo-600">
      <div className='my-10 md:my-14 border-4 border-indigo-400 text-white rounded-lg py-4 px-2 md:px-10'>
        <h1 className='text-center text-2xl md:text-3xl font-semibold'>
          Questions fréquemments posées
        </h1>
      </div>
      <div className='w-full md:w-4/5 flex flex-col items-center text-white border-4 border-indigo-400 rounded-lg p-4 md:p-10'>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Cette plateforme est pour qui ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              WE BLESS YOU est une plateforme qui s&apos;adresse à tout enfant de Dieu né de nouveau, de partout autour du globe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-10">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Comment participer ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Un abonnement mensuel sans engagement est demandé à chaque utilisateur. <br/>
              Il sera de 2€ / mois pour la zone Euro.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Pourquoi donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              <span>Luc 6:38 nous dit: Donnez et il vous sera donné...</span><br/>
              <span>et Proverbes 11:25 dit: une personne généreuse sera comblée de biens en retour...</span>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Combien donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Chacun pourra donner librement un des montants que même le plus démuni d&apos;entre nous pourra donner. 
              En zone Euro par exemple ce sera: entre 5€, 10€, 20€, 50€, 100€ et 200€.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              A qui donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              A tout enfant de Dieu, qui aura lui-même déjà donné à un autre, le même montant que vous aurez choisi de lui donner.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Comment donner?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Une fois que vous aurez choisi votre destinataire, vous aurez accès à ses coordonnées. 
              vous lui ferez un transfert par numéro de portable (via Wero pour l&apos;Europe par exemple, 
              ou MoMo pour l&apos;Afrique). <br/><br/> ( NB: Ce processus est provisoir. )
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Comment recevoir?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Vous n&apos;aurez rien à faire, votre banque vous informera forcement de la reception d&apos;un transfert.
              Parfois le donataire vous enverra un SMS.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Comment savoir qu&apos;un transfert vient de WBY ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Un numéro unique dit <span className='font-semibold'>Donation Number</span> est 
              généré au donateur quand il vous choisi, il entre ce numéro sous le format 
              (exemple: WBY-2954) dans le libellé du transfert, et vous l&apos;envoie aussi 
              par SMS, afin que vous puissiez le voir dans l&apos;historique du transfert reçu, et 
              l&apos;utiliser ensuite pour confirmer la réception du transfert.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Peut-on donner plusieurs fois à la même personne ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
            Non, une personne que vous avez déjà bénie ou qui vous a déjà 
            béni ne pourra pas apparaître dans votre liste de personnes à bénir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              Peut-on dès maintenant bénir quelqu&apos;un autour du monde ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              Non, pour l&apos;instant seule la zone Euro est concernée. <br/>
              Nous ajouterons d&apos;autres zones monétaires au fur et à mésure et vous dirons si 
              c&apos;est possible de donner d&apos;une zone vers l&apos;autre.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div> 
  )
}
//
export default Faq

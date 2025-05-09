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
              WBY est pour qui ?
            </AccordionTrigger>
            <AccordionContent className='text-xl leading-relaxed'>
              WE BLESS YOU est une plateforme qui s&apos;adresse à tout enfant de Dieu né de nouveau, de partout autour du globe.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Comment participer ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Un abonnement mensuel, sans engagement, est demandé à chaque utilisateur. <br />
              Par exemple, en zone euro, il est de 2 € par mois.
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
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Combien peut-on donner ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Vous choisissez librement un montant parmi ceux proposés. <br />
              En zone euro par exemple : 5 €, 10 €, 20 €, 50 €, 100 € ou 200 €.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className='text-start text-2xl font-semibold'>
              A qui donner?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              À l&apos;une des deux personnes qui vous seront proposées. Elles-mêmes ayant 
              déjà donné ce même montant à une autre personne.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Comment faire un don ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Une fois le destinataire choisi, vous verrez son prénom et son numéro de téléphone. 
              Vous ferez ensuite un transfert par numéro (via Wero, par exemple, pour l&apos;Europe). <br /><br />
              <span className="italic">NB : ce processus est provisoire et pourra évoluer.</span>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Comment reçoit-on un don ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Vous serez notifié directement par votre application bancaire ou de transfert (ex. : Wero) 
              dès que vous recevrez un don. <br /> Le donateur peut également vous prévenir par SMS.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Comment reconnaître un don venant de WBY ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Le donateur reçoit un numéro unique appelé <span className="font-semibold">Donation Number</span>. <br />
              Il le place dans le libellé du transfert (ex: WBY-2954) et peut aussi vous l&apos;envoyer par SMS. 
              Vous pourrez alors l&apos;identifier dans l&apos;historique de vos virements.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Peut-on donner plusieurs fois à la même personne ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Non. Une même personne ne peut pas apparaître deux fois dans votre parcours : 
              ni comme bénéficiaire, ni comme donateur.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Peut-on donner à quelqu&apos;un dans un autre pays ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Pour le moment, seule la zone euro est active. <br />
              Nous prévoyons d&apos;ouvrir progressivement à d&apos;autres zones monétaires. 
              Vous serez informé·e dès que cela sera possible.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-12">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Puis-je annuler un don une fois envoyé ?
              </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Non, une fois le don effectué, il n&apos;est pas remboursable. Assurez-vous d&apos;être 
              certain·e avant d&apos;envoyer le transfert.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-13">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Que se passe-t-il si je ne fais pas le don après avoir vu les coordonnées ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Ne pas effectuer le don après avoir choisi un donataire est une tromperie. Cela peut entraîner
              l&apos;exclusion de la plateforme.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-14">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Que se passe-t-il si je me trompe de numéro lors du transfert?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Nous ne considérerons pas cela comme un WBY. Il vous restera 
              à demander par sms à la personne qui aura reçu votre argent par erreur 
              de bien vouloir vous le retransférer.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-15">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Combien de temps ai-je pour faire un don ou pour en confirmer un reçu ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Le mieux est de le faire dans l&apos;heure, mais vous aurez jusqu'à 12 heures maximum dans les deux cas.
              Passé ce délai, nous, votre destinataire, ou donateur, pourrons vous relancer.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-16">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Que faire si on me contacte hors cadre du don ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Signalez immédiatement tout comportement inapproprié. Le respect de la confidentialité
              et des limites est essentiel sur WBY.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-17">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              Mes infos personnelles sont-elles partagées ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Non. Seuls votre prénom et votre numéro sont partagés temporairement avec le 
              donateur ou le destinataire, après validation.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-18">
            <AccordionTrigger className="text-start text-2xl font-semibold">
              La plateforme prend-elle une commission sur les dons ?
            </AccordionTrigger>
            <AccordionContent className="text-xl leading-relaxed">
              Non. La totalité du don va directement au bénéficiaire. 
              Le seul coût est l&apos;abonnement mensuel, qui permet à la plateforme d&apos;exister.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div> 
  )
}
//
export default Faq

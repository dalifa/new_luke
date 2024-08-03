import { Card } from '@/components/ui/card'
import Image from 'next/image'
import wallpaper1 from '@/public/assets/images/wallpaper1.jpg'
import BackButton from '@/components/nav/backButton'

const luke = "Luke 6:38" 

const Ccm = () => {
    return ( 
        <div className='relative flex w-full items-center flex-col pb-20 px-2'>
            
            <Card className='flex flex-col w-full lg:w-4/5 gap-y-5 overflow-auto mt-48 p-5 lg:p-10 pb-10 lg:pb-24 bg-white leading-relaxed text-justify'>
            <div className='flex flex-row items-start justify-between gap-x-5 text-blue-500'>
                <div className='border-[1px] rounded-md border-blue-500 hover:text-white hover:bg-blue-500'>
                  <BackButton/>
                </div>
                <div className=''>
                  <h1 className='text-lg lg:text-2xl font-semibold'>
                    Comment ça marche
                  </h1>
                </div>
              </div>
                <div>
                    <h1 className='text-xl lg:text-2xl font-semibold my-3 text-blue-800'>
                        Le Concept
                    </h1>
                    <p className='text-md lg:text-lg font-normal'>
                        <span className='font-medium'>{luke}</span> est une plateforme de financement participatif par le don,
                        basée sur les principes de générosité et de réciprocité.
                        <br/>
                        Elle propose la participation à des <span className='font-meduim'>Collectes</span> de deux types, 
                        <span className='font-medium'> Collecte Snippet</span> et <span className='font-medium'>Collecte Totality </span>
                        dans lesquelles vous pouvez financer ou vous faire financer vos courses, shoppings, factures ou tout autres besoins ou projets.
                    </p>
                </div>
                <div>
                    <h1 className='text-xl lg:text-2xl font-semibold my-3 text-blue-800'>
                        Notre cible
                    </h1>
                    <p className='text-md lg:text-lg font-normal'>
                        Cette plateforme s&apos;adresse exclusivement aux chrétiens généreux de toutes les églises qui soient, autour du globe.<br/>
                    </p>
                </div>
                <div>
                    <h1 className='text-xl lg:text-2xl font-semibold my-3 text-blue-800'>
                        Processus
                    </h1>

                    <h2 className='text-slate-500 text-lg lg:text-xl mt-3'>
                        Pour s&apos;inscrire
                    </h2>
                    <p className='text-md lg:text-lg font-normal'>
                        Il faut exclusivement avoir un compte <span className='font-medium'>Google</span> pour prétendre s&apos;inscrire sur <span className='font-medium'>{luke}</span>.
                    </p>
                    <h2 className='text-slate-500 text-lg lg:text-xl mt-3'>
                        Pour créditer son compte
                    </h2>
                    <p className='text-md lg:text-lg font-normal'>
                        Dans ces premiers temps de lancement de notre plateforme, nous vous proposons de passer par l&apos;un de nos partenaires, dont vous trouverez la liste
                        dans votre espace personnel, pour approvisionner votre compte.<br/>
                        Vous pourrez lui remettre l&apos;argent de la main à la main et en votre présence, il validera votre approvisionnement, ou lui faire un transfert de type 
                        Palib par exemple pour la France ou MoMo pour certains pays d&apos;Afrique. Gardez la preuve de votre transfert, ce qui nous permettra de garantir votre argent.<br/>
                        Ceci est provisoir, nous vous donnerons la possibilité d&apos;approvisionner votre compte directement sur la plateforme avec votre carte bancaire, dans 
                        les mois à venir. 
                    </p>
                    <h2 className='text-slate-500 text-lg lg:text-xl mt-3'>
                        Pour participer à une collecte
                    </h2>
                    <p className='text-md lg:text-lg font-normal'>
                        Dans votre espace personnel, choisissez le type de collecte, ainsi que le montant de votre choix que vous voulez donner.<br/><br/>
                        Une fois votre groupe complet, vous pourrez donner pour le financement du projet de la personne de votre choix, et le cas échéant, 
                        recevoir de ceux qui vous auront choisi. 
                        <br/><br/>
                        Dans une <span className='font-medium'>Collecte Snippet</span>,<br/> 
                        vous recevez autant de fois le montant initial, que vous avez choisi de donner, qu&apos;il y aura de participants qui vous auront choisi.
                        <br/>
                        Par exemple, si votre groupe est de 20 participants, et le montant choisi est de 5€. Si 5 participants choisissent de vous donner leur
                        participation, vous recevrez 5 x 5€ soit 25€.
                        <br/>
                        <br/>
                        Par contre dans une <span className='font-medium'>Collecte Totality</span>,<br/>
                        c&apos;est le plus désigné qui reçoit la cagnotte, c&apos;est-à-dire la totalité de la somme formée par les participations de tout le groupe.
                        <br/>
                        Par exemple, si votre groupe est de 20 participants, et que le montant choisi est de 10€. Si 5 participants choisissent de vous donner leur 
                        participation, et que vous êtes le seul de votre groupe à avoir été choisi 5 fois, vous recevrez 20 x 10€ soit 200€.
                        <br/><br/>
                        <span className='text-slate-500'>NB:</span><br/>
                        Dans le cas ou vous serez 2, 3 ou 4 sur 20 à avoir été choisi 5 fois, la cagnotte est divisée par 2, 3 ou 4.
                    </p> 
                    <h2 className='text-slate-500 text-lg lg:text-xl mt-3'>
                        Votre Cagnotte
                    </h2>
                    <p className='text-md lg:text-lg font-normal'>
                        Vous pouvez récupérer tout ou partie de votre cagnotte en faisant une demande de transfert depuis votre espace personnel.
                        <br/><br/>
                        Un de nos partenaire vous fera par la suite un Paylib pour l&apos;europe ou un MoMo pour l&apos;Afrique par exemple, de la somme demandée.<br/><br/>
                        Vous pouvez aussi transférer depuis un formulaire dédié à cet effet, tout ou partie de votre cagnotte vers votre crédit pour
                        la redonner dans des collectes ultérieurs.<br/><br/>
                    </p>
                    <h2 className='text-slate-500 text-lg lg:text-xl mt-3'>
                        Continuité et amélioration du service
                    </h2>
                    <p className='text-md lg:text-lg font-normal'>
                        <span className='font-medium'>{luke}</span> prélèvera 5% sur votre cagnotte au moment de vous la transférer.<br/>
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default Ccm

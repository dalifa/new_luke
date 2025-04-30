import { JoinButton } from "@/components/auth/public-join-button"

import Link from "next/link"
import { Suspense } from "react"
//
const Home = () => {
  return (
    <div className="h-full overflow-y-auto bg-indigo-600">
      {/* Section 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 md:pt-10">
        {/* Texte en haut (mobile), à gauche (desktop) */}
        <div className="h-full flex items-center justify-center p-10">
          <div className="flex flex-col gap-8 px-10 py-5 md:p-10">
            <div className="text-white text-4xl md:text-7xl font-bold">
              <h1>
                Parce que donner est le meilleur moyen de recevoir.
              </h1>
            </div>
            <div className="text-2xl text-white font-light">
              <p>La plateforme où tout enfant de Dieu peut librement bénir un autre, et être lui-même béni par d&apos;autres en retour.</p>
            </div>
            <div className="bg-indigo-600 border-none ">
            <Suspense fallback={null}>
              <JoinButton/>
             </Suspense> 
            </div>
          </div>
        </div>
        {/* Image en bas (mobile), à droite (desktop) */}
        <div className="w-full h-full flex md:p-0 border-x-2 border-indigo-600">
          <img
            src={`/assets/donner.jpg`}
            alt="image 1"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* section 2 */}
      <div className="flex flex-col items-center justify-center text-white border-t-4 border-t-white py-10 md:py-20 text-3xl md:text-5xl font-semibold">
        <h2>Comment ça marche ?</h2>
      </div>
      {/* section 3 */}

      <div className="flex flex-col items-center p-4 space-y-10 md:space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row rounded-lg">
          <img
            src={`/assets/argent.jpg`}
            alt="image 1"
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-r-lg md:rounded-l-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Choisissez un montant que vous êtes prêt à donner de bon coeur.
            </h1>
          </div>
        </div>
        {/* 2 */}
        <div className="flex flex-col md:flex-row-reverse rounded-lg">
          <img
            src={`/assets/donataires.jpg`}
            alt="image 1"
            className="w-full h-full md:w-1/2 object-cover rounded-t-lg md:rounded-r-lg md:rounded-l-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Sélectionner une personne à bénir parmi les profils qui vous seront proposés.
            </h1>
          </div>
        </div>
        {/* 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row rounded-lg">
          <img
            src={`/assets/transfert.jpg`}
            alt="image 1"
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-r-lg md:rounded-l-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Faites lui votre don directement en toute transparence, de personne à personne,
              via Wero, ou votre App bancaire.
            </h1>
          </div>
        </div>
        {/* 4 */}
        <div className="flex flex-col md:flex-row-reverse rounded-lg">
          <img
            src={`/assets/giv1.jpg`}
            alt="image 1"
            className="w-full h-full md:w-1/2 object-cover rounded-t-lg md:rounded-r-lg md:rounded-l-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
            Le donataire confirme la reception du don, et vous êtes à votre tour 
            rendu visible auprès des prochains donateurs.
            </h1>
          </div>
        </div>
      </div>
      {/* section 4 */}
      <div className="flex flex-col items-center justify-center text-white bg-indigo-600 py-10 md:py-20 text-3xl md:text-5xl font-semibold">
        <h2 className="text-center">Pourquoi cette approche ?</h2>
      </div>
      {/* section 5 */}
      <div className="h-full flex flex-col items-center justify-center bg-white font-semibold">
        <div className="grid grid-cols-1 md:grid-cols-2 m-10 text-slate-700 gap-5">
          <div className="bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <p className="text-center">Vous êtes enfants de Dieu.</p>
          </div>
          <div className="bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <p className="text-center">Vous êtes généreux.</p>
          </div>
          <div className="bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <p className="text-center">On peut vous faire confiance.</p>
          </div> 
          <div className="bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <p className="text-center">Pas d&apos;intermédiaire financier.</p>
          </div>
          <div className="bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <p className="text-center">100% transparent: vous voyez à qui vous donnez.</p>
          </div>
          <div className="bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <p className="text-center">Pas de robot, pas de faux utilisateurs.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-white bg-indigo-600 px-4 md:px-10 py-10 md:py-20 font-semibold">
        <p className="text-center text-3xl leading-relaxed">
          Notre but ultime est de faire en sorte qu&apos;il soit possible que, n&apos;importe lequel des enfants de Dieu, de n&apos;importe où autour du monde, bénisse et/ou soit béni par n&apos;importe lequel de ses frères ou soeurs en Christ Jésus.
        </p>
      </div>
      <div className="mb-10">
        <div className="flex flex-col text-white space-y-5 text-2xl md:text-3xl">
          <div className="p-4 mt-5">
            <h1 className="text-center font-semibold">Vous avez des questions ?</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link href={"/faq"} className="bg-green-600 rounded-lg p-4 hover:bg-green-700">
              <p>Nos réponses sont ici </p>
            </Link>
          </div>
        </div>
        <div className="my-14 text-white text-2xl md:text-3xl">
          <h1 className="text-center">Bénissez et on vous bénira!</h1>
        </div>
      </div>
    </div>
  )
}
//
export default Home


/*

        <div className="flex flex-col md:flex-row-reverse rounded-lg border-2 border-yellow-400">
          <img
          src={`/assets/giv1.jpg`}
          alt="image 1"
          className="w-full md:w-1/2 h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Une fois le don confirmé par votre donataire, vous entrez à votre tour dans 
              la boucle et devenez visible auprès des prochains donateurs.
            </h1>
          </div>
        </div>
*/
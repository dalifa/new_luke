
import { JoinButton } from "@/components/auth/public-join-button"
import { HandCoins, Handshake, UserRoundCheck } from "lucide-react"

import Link from "next/link"
import { Suspense } from "react"
import { FaRobot } from "react-icons/fa"
import { FaUsersBetweenLines } from "react-icons/fa6";
import { FaPray } from "react-icons/fa";
import Image from "next/image"
//
const Home = () => {
  return (
    <div className="h-full overflow-y-auto bg-indigo-600">
      {/* Section 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 pt-10 md:pt-10">
        {/* Texte en haut (mobile), à gauche (desktop) */}
        <div className="h-full flex flex-col items-center justify-center px-4 py-10 md:p-10">
          <div className="flex flex-col gap-8 px-5 py-5 md:p-10">
            <div className="text-white text-4xl md:text-7xl font-bold">
              <h1>
                Parce qu&apos;il n&apos;y a de plus grand amour que de donner...
              </h1>
            </div>
            <div className="text-2xl text-white font-light">
              <p>
                We Bless You est une plateforme chrétienne pour s’entraider, s’équiper, et se bénir les uns les autres, 
                dans tous les domaines de la vie. {/*: éducation, mariage, formation, projets, besoins personnels.*/}
              </p>
            </div>
            <div className="bg-indigo-600 border-none ">
              <Suspense fallback={null}>
                <JoinButton/>
              </Suspense> 
            </div>
            <div>
              <p className="text-center mt-4 text-black hover:text-red-600 font-semibold rounded-full mr-4 p-2 bg-yellow-400 hover:bg-white">NB:&nbsp;SITE EN BETA-TEST EXCLUSIf</p>
            </div>
          </div>
        </div>
        {/* Image en bas (mobile), à droite (desktop) */}
        <div className="w-full h-full flex md:p-0 border-x-2 border-indigo-600">
          <Image
            src={`/assets/donner.jpg`}
            alt="image 1"
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col items-center p-4 space-y-10 md:space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row rounded-lg">
          <div className="flex flex-col items-center justify-center text-3xl md:text-5xl font-semibold text-white">
            <h1>Bénir</h1>
          </div>
          <div className="flex flex-col items-center justify-center bg-white rounded p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Vous pouvez vous connecter juste pour faire du bien à un frère ou une soeur dans le besoin.
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row rounded-lg">
        <div className="flex flex-col items-center justify-center text-3xl md:text-5xl font-semibold text-white">
            <h1>Bénir et être béni</h1>
          </div>
          <div className="flex flex-col items-center justify-center bg-white rounded p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Vous pouvez vous connecter pour bénir un frère ou une soeur et éventuellement être vous même béni en retour.
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row rounded-lg">
        <div className="flex flex-col items-center justify-center text-3xl md:text-5xl font-semibold text-white">
            <h1>Être béni</h1>
          </div>
          <div className="flex flex-col items-center justify-center bg-white rounded p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Même si pour l&apos;instant vous n&apos;avez rien à donner à un autre, vous pouvez vous connecter et vous attendre à être béni
              par une personne de bonne volonté.
            </h1>
          </div>
        </div>
       </div> 
      {/* section 2 */}
      <div className="flex flex-col items-center justify-center text-white border-t-4 border-t-white py-10 md:py-20 text-3xl md:text-5xl font-semibold">
        <h2>Comment ça marche ?</h2>
      </div>
      {/* section 3 */}

      <div className="flex flex-col items-center p-4 space-y-10 md:space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row rounded-lg">
          <Image
            src={`/assets/argent.jpg`}
            alt="image 1"
            width={800}
            height={600}
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
          <Image
            src={`/assets/donataires.jpg`}
            alt="image 1"
            width={800}
            height={600}
            className="w-full h-full md:w-1/2 object-cover rounded-t-lg md:rounded-r-lg md:rounded-l-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Vous serez integré à un groupe où vous selectionnerez une personne à bénir.
            </h1>
          </div>
        </div>
        {/* 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:flex-row rounded-lg">
          <Image
            src={`/assets/transfert.jpg`}
            alt="image 1"
            width={800}
            height={600}
            className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-r-lg md:rounded-l-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
              Faites lui votre don directement en toute transparence, de personne à personne,
              via une App de transfert.
            </h1>
          </div>
        </div>
        {/* 4 */}
        <div className="flex flex-col md:flex-row-reverse rounded-lg">
          <Image
            src={`/assets/giv1.jpg`}
            alt="image 1"
            width={800}
            height={600}
            className="w-full h-full md:w-1/2 object-cover rounded-t-lg md:rounded-r-lg md:rounded-l-none"
          />
          <div className="flex flex-col items-center justify-center bg-white rounded-b-lg md:rounded-l-lg md:rounded-r-none p-4">
            <h1 className="text-2xl md:text-3xl text-center text-slate-700 font-semibold">
            Le donataire confirme la reception du don, ce qui vous permet de bénir à nouveau si tel est votre souhait.
            </h1>
          </div>
        </div>
      </div>
      {/* section 4 */}
      <div className="flex flex-col items-center justify-center text-white bg-indigo-600 px-2 py-10 md:py-20 text-3xl md:text-5xl font-semibold">
        <h2 className="text-center">Pourquoi cette approche ?</h2>
      </div>
      {/* section 5 */}
      <div className="h-full flex flex-col items-center justify-center bg-white font-semibold">
        <div className="grid grid-cols-1 md:grid-cols-2 m-10 text-slate-700 gap-5">
          <div className="flex flex-col text-indigo-600 items-center space-y-2 bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <FaPray/>
            <p className="text-center">Vous êtes enfants de Dieu.</p>
          </div>
          <div className="flex flex-col text-indigo-600 items-center space-y-2 bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <HandCoins/>
            <p className="text-center">Vous êtes généreux.</p>
          </div>
          <div className="flex flex-col text-indigo-600 items-center space-y-2 bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <Handshake/>
            <p className="text-center">On peut vous faire confiance.</p>
          </div> 
          <div className="flex flex-col text-indigo-600 items-center space-y-2 bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
          <FaUsersBetweenLines/>
            <p className="text-center">Pas d&apos;intermédiaire financier.</p>
          </div>
          <div className="flex flex-col text-indigo-600 items-center space-y-2 bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <UserRoundCheck/>
            <p className="text-center">100% transparent: vous voyez à qui vous donnez.</p>
          </div>
          <div className="flex flex-col text-indigo-600 items-center space-y-2 bg-indigo-200 text-2xl md:text-3xl p-4 rounded-lg">
            <FaRobot/>
            <p className="text-center">Pas de robot, pas de faux utilisateurs.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-white bg-indigo-600 px-4 md:px-10 py-10 md:py-20 font-semibold">
        <p className="text-center text-3xl leading-relaxed">
        Notre but ultime: Permettre à chaque enfant de Dieu, partout dans le monde, de bénir et d&apos;être béni continuellement.
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
export default function Home() {
    return (
      <main className="min-h-screen bg-white text-gray-800 px-6 py-12">
        <div className="w-4/5 mx-auto space-y-12 mt-14 border-2 border-red-400">
  
          <section className="text-center">
            <p className="mt-4 text-xl text-gray-600">
            We Bless You” est une plateforme chrétienne pour s’entraider, s’équiper, et se bénir les uns les autres, 
            dans tous les domaines de la vie : éducation, mariage, formation, projets, besoins personnels.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">🌍 Vision</h2>
            <p className="text-lg">
              Bâtir une communauté chrétienne francophone où chacun peut bénir et être béni, dans l’amour, la prière, 
              et la solidarité pratique.
            </p>
            <p>
            Nous croyons que chaque chrétien est appelé à être une source de bénédiction pour les autres, dans tous les 
            domaines de la vie : l’éducation, la famille, les projets, les défis personnels. We Bless You est un espace 
            où la foi devient action, où l’amour devient soutien concret.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">🎯 Mission</h2>
            <h3>
              Pourquoi nous existons :
            </h3>
            <p>
              <strong>Bénir au quotidien :</strong> “Bénissez ceux qui vous persécutent…” (Romains 12:14)
            </p>
            <p>
              Encourager la bénédiction entre frères et sœurs en Christ<br/>
              Que ce soit par un don, une prière, un conseil, une oreille attentive : bénir est notre premier réflexe.
            </p>
            <h3>
              Manifester l’amour de Dieu à travers des actions concrètes
            </h3>
            <p>
              <strong>Aimer par les actes :</strong> (Jean 15:13)
            </p>
            <p>
              “Il n’y a pas de plus grand amour que de donner sa vie pour ses amis.” (Jean 15:13) <br/>
              Nous croyons que l’amour de Christ nous pousse à nous engager pour les autres, même à petite échelle.
            </p>
            <h3>
              Créer un réseau d’entraide chrétien, authentique et transparent
            </h3>
            <p>
              <strong>Porter les fardeaux :</strong> (Galates 6:2)
            </p>
            <p>
              “Portez les fardeaux les uns des autres, et vous accomplirez ainsi la loi de Christ.” (Galates 6:2) <br/>
              Un lieu sûr pour partager ses besoins, ses projets, ses fardeaux… et trouver des frères et sœurs prêts à 
              répondre.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">✝️ Nos Valeurs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <strong>Amour actif</strong><br />
                Jean 15:13 – Donner, prier, accompagner
              </div>
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <strong>Bénédiction</strong><br />
                Romains 12:14 – Parole, acte, partage
              </div>
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <strong>Partage des fardeaux</strong><br />
                Galates 6:2 – Soutien spirituel et matériel
              </div>
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <strong>Générosité joyeuse</strong><br />
                2 Corinthiens 9:7 – Donner avec foi
              </div>
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <strong>Édification</strong><br />
                Éphésiens 4:12 – Faire grandir l’autre
              </div>
            </div>
          </section>
  
          <footer className="text-center text-sm text-gray-500 mt-12">
            © {new Date().getFullYear()} We Bless You – Pour bénir et bâtir ensemble
          </footer>
        </div>
      </main>
    );
  }
  */
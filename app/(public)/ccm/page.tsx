
//
const Ccm = () => {
  return ( 
    <div className='flex flex-col w-full h-full space-y-10 items-center py-12 px-5 bg-indigo-600 text-white'>
      <div className='flex flex-col w-full md:w-4/5 border-4 border-indigo-400 rounded-xl items-center justify-center py-4 md:py-5 mt-10 text-white text-2xl md:text-3xl font-medium shadow-sm'>
        <h1>Comment ça marche</h1>
      </div>
      <div className="flex flex-col gap-y-10 p-4 w-full md:w-4/5 shadow-sm border-4 border-indigo-400 rounded-xl">
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-16 h-16 md:w-20 md:h-20">
            <p>1</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Inscription, Connexion et Infos de Profil
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
            L&apos;inscription se fait uniquement via un compte Gmail. Lors de votre première connexion, vous complétez votre profil
            avec vos vraies informations. Un code PIN personnel vous est attribué pour faciliter votre identification dans le système.</p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-16 h-16 md:w-20 md:h-20">
            <p>2</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Paiement et Validation de l&apos;Abonnement
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              L&apos;abonnement à WBY coûte 2 €/mois (ou 6 € pour 3 mois). Vous envoyez ce montant via <strong>WERO</strong> ou votre app bancaire au numéro <strong>06 ** ** ** *1</strong> 
              de WBY. Ajoutez votre code PIN dans le libellé (ex: <strong>WBY-2315</strong>). La validation étant manuelle, peut prendre jusqu&apos;à 24 h.
              <br /><br />
              🌍 Vous êtes hors zone euro ? Rassurez-vous, WBY s&apos;ouvrira bientôt à d&apos;autres zones monétaires.
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-16 h-16 md:w-20 md:h-20">
            <p>3</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Engagement à Bénir et Choix du Destinataire
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
            Une fois abonné·e, vous choisissez librement un montant à donner. Deux profils de bénéficiaires vous sont alors proposés. 
            Après validation du profil choisi, ses infos vous sont transmises (prénom + téléphone), ainsi qu&apos;un <strong>Donation Number</strong> unique.
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-16 h-16 md:w-20 m:h-20">
            <p>4</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Transfert via WERO ou App Bancaire
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              Effectuez le virement (via WERO ou votre app bancaire) directement au bénéficiaire en ajoutant le <strong>Donation Number</strong> dans le libellé (ex: WBY-2547). 
              Revenez ensuite sur WBY pour cliquer sur “Transfert effectué”.
              <br /><br />
              ⚠️ Lorsque vous accédez aux informations du destinataire, vous vous engagez à finaliser le don. Tout manquement à cette étape nuit à la confiance du système et peut entraîner votre radiation.
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-16 h-16 md:w-20 md:h-20">
            <p>5</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Confirmation côté Destinataire
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
            Le bénéficiaire confirme sur WBY qu&apos;il a bien reçu votre don en saisissant le <strong>Donation Number</strong> dans un formulaire dédié. 
            Cela vous rend éligible pour être visible par les futurs donateurs et potentiellement recevoir à votre tour.
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-4xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-16 h-16 md:w-20 md:h-20">
            <p>NB</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4 pb-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Particularités
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
            • Vous pouvez payer plusieurs mois d&apos;abonnement à l&apos;avance à votre convenance. <br/><br/>
            • Après avoir effectué votre don, vous pouvez envoyer le Donation Number par SMS au destinataire (ex: WBY-2425).<br/><br/>
            • Les profils qui vous sont proposés comme destinataires sont ceux qui ont déjà donné le même montant que celui que vous avez choisi.<br/><br/>
            • Une personne à qui vous avez déjà donné, ou qui vous a déjà donné, ne pourra plus vous être proposée à l&apos;avenir.<br/><br/>
            • Ne confirmez pas un destinataire si vous n&apos;avez pas réellement l&apos;intention d&apos;effectuer le don. Une fois ses coordonnées
            visibles, le respect de votre engagement est essentiel. En cas de manquement, votre compte pourrait être suspendu.<br/><br/>
            ⚠️ L&apos;utilisation des coordonnées du destinataire à d&apos;autres fins que le don est strictement interdite.<br/><br/>
            Tout usage abusif (sollicitations, messages personnels, prospection, etc.) constitue une violation des règles de la plateforme et peut 
            entraîner une exclusion définitive, voire des poursuites si les faits le justifient.<br/><br/>
            ⚠️ Chaque parcours peut se conclure de trois manières : <br/><br/>
            <strong>1-</strong> Aucun des deux donateurs ne vous a choisi.<br/>
            <strong>2-</strong> Un seul des deux donateurs vous a choisi.<br/>
            <strong>3-</strong> Les deux donateurs vous ont choisi.<br/><br/>
            Cela signifie que, pour chaque parcours, <strong>vous avez 50% de chance de recevoir le double de ce que vous avez donné.</strong>
            </p>
          </div>
        </div>
        {/* */}
      </div>
    </div>
  )
}
//
export default Ccm

/*
*/

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
              L&apos;abonnement à WBY coûte 2€/mois (ou 6€ pour 3 mois 😉). Vous envoyez ce montant via <strong>WERO</strong> ou votre app bancaire au numéro <strong>06*******1</strong> 
              &nbsp;de WBY. Ajoutez votre code PIN dans le libellé du transfert (ex: <strong>WBY-2315</strong>). La validation étant manuelle, peut prendre jusqu&apos;à 24h.
              <br /><br />
              🌍 Vous êtes hors zone euro? Rassurez-vous, WBY s&apos;ouvrira bientôt à d&apos;autres zones monétaires.
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
            Une fois abonné·e, vous pourrez choisir librement un montant à donner.<br/>
            Vous serez alors intégré.e dans un groupe où tous veulent donner le même montant.<br/>
            Choisissez-y une personne à bénir, après confirmation de votre choix, ses infos vous seront affichées: (prénom + téléphone),
            ainsi qu&apos;un <strong>Donation Number</strong> unique.
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
              Transfert via WERO ou autre App
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              Effectuez le virement (via WERO ou votre app bancaire) directement au bénéficiaire par son numéro de portable.<br/>
              Mettez le <strong>Donation Number</strong> dans le libellé du transfert (ex: WBY-2547), et envoyez-le lui par SMS.<br/> 
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
            Le bénéficiaire de votre don, confirme sur WBY qu&apos;il a bien reçu votre don en saisissant le <strong>Donation Number</strong>
            reçu dans le libellé du transfert et par SMS, dans un formulaire dédié.<br/> <br/>
            Cela vous permet de pouvoir à nouveau donner ce montant si vous le souhaitez.
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
            • Si quelqu&apos;un dans le groupe, vous choisi comme destinataire de son don, vous ne pourrez plus le choisir en retour.<br/>
              Sauf si tous dans le groupe vous ont choisi.<br/><br/>

            • Vous pouvez payer plusieurs mois d&apos;abonnement à l&apos;avance à votre convenance. <br/>
              Ça evite d&apos;oublier ou de faire des paiements (transferts) chaque mois.<br/><br/>

            • Entrez le Donation Number dans le libellé du transfert ou dans le SMS sous ce format (ex: WBY-2425).<br/><br/>

            • Les profils dans votre groupe, seront toujours des personnes à qui vous n&apos;avez jamais donné et qui ne vous ont jamais donné.<br/><br/>

            • Tant que le groupe n&apos;est pas au complet vous pouvez toujours le quitter.<br/><br/>

            ⚠️ L&apos;utilisation à d&apos;autres fins que le don, des coordonnées de votre donateur ou destinataire est strictement interdite.<br/>
            Tout usage abusif (sollicitations, messages personnels, prospection, etc.) constitue une violation des règles de la plateforme et peut 
            entraîner une exclusion définitive, voire des poursuites si les faits le justifient.<br/><br/>

            ⚠️ Chaque participation à un groupe peut se conclure de plusieurs manières: <br/><br/>
            <strong>1-</strong> Tous dans le groupe vous ont choisi comme destinataire.<br/>
            <strong>2-</strong> Une ou plusieurs vous ont choisi comme destinataire.<br/>
            <strong>3-</strong> Personne ne vous a choisi comme destinataire.<br/><br/>
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
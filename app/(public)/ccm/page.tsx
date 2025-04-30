
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
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-20 h-20">
            <p>1</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Inscription, Connexion et Infos de Profil
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              L&apos;inscription et la connexion à WBY, se font uniquement via une adresse Gmail. 
              Lors de votre première connexion, Il vous sera demandé de renseigner vos vraies 
              informations personnelles. Ensuite un code PIN vous sera généré et servira à 
              vous identifier plus facilement.</p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-20 h-20">
            <p>2</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Paiement et Validation de l&apos;Abonnement
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              L’abonnement à la plateforme, sans engagement, coûte 2 €/mois pour la zone euro.
              Pour ce faire, effectuez un transfert de 2 € (ou de 6 € pour trois mois 😉)
              via WERO ou votre app bancaire, au numéro 06*******1 de WBY.
              N’oubliez pas d’indiquer votre code PIN dans le libellé, sous le format :
              (ex. : WBY-2315).
              La validation n’étant pas automatique, elle peut prendre jusqu’à 24 h maximum.
              <br/> Si votre zone monétaire est différente de la zone euro, nous vous tiendrons informé·e
              du processus d’abonnement dès que WBY y sera accessible..
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-20 h-20">
            <p>3</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Engagement à Bénir et Choix du Destinataire
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              Une fois votre abonnement confirmé, vous pourrez vous engager librement à bénir un frère ou une soeur en Christ,
              en choisissant un montant à donner. Ensuite une liste de bénéficiaires vous sera proposée. une fois que vous aurez
              confirmé le choix du destinataire, vous ne pourrez plus vous désister, car il dévoile son prénom ainsi que son numéro de portable,
              Un code à usage unique dit: <span className="font-semibold">Donation Number</span> vous est aussi généré à cette occasion.
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-20 h-20">
            <p>4</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Transfert via WERO ou App Bancaire
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              Depuis votre App bancaire ou WERO (pour L&apos;Europe), faite le virement par numéro de portable
              au destinataire choisi, avec le Donation Number dans le libellé au format: ( ex: WBY-2547 ). 
              Revenez ensuite sur WBY pour confirmer le transf
              ert en cliquant sur le bouton dédié. <br/>
              <span className="font-semibold">⚠️ Ne pas transférer le montant après avoir pris connaissance des infos personnelles du destinataire, 
              peut être considéré comme de la tromperie et peut entraîner votre radiation de la plateforme.</span>
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-6xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-20 h-20">
            <p>5</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Confirmation côté Destinataire
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              Le destinataire est averti de la réception du transfert et doit le confirmer sur WBY via un formulaire dédié. 
              Il y entre le Donation Number reçu dans le libellé du transfert, une fois la confirmation faite, vous êtes intégré
              dans la liste des personnes pouvant être bénies à leur tour du même montant.
            </p>
          </div>
        </div>
        {/* */}
        <div className="flex flex-col md:flex-row flex-grow min-h-[100px] gap-5">
          <div className="basis-1/3 flex items-center justify-center text-white text-4xl">
          <div className=" flex items-center justify-center rounded-full bg-white text-indigo-600 w-20 h-20">
            <p>NB</p>
          </div>
          </div>
          <div className="basis-2/3 flex flex-col gap-y-4">
            <h1 className="text-xl md:text-2xl text-white font-semibold">
              Particularités
            </h1>
            <p className="text-xl md:text-2xl text-white text-justify">
              - La plateforme WBY est exclusivement ouverte qu&apos; aux Chrétiens de la zone Euro pour l&apos;instant.
            </p>
            <p className="text-xl md:text-2xl text-white text-justify">
              - Vous pouvez payer plusieurs mois d&apos;abonnement à l&apos;avance.
            </p>
            <p className="text-xl md:text-2xl text-white text-justify">
              - Vous pouvez aussi, après avoir fait le transfert, 
              envoyer le Donation Number au destinataire par sms toujours sous le format: (ex: WBY-2425). 
            </p>
            <p className="text-xl md:text-2xl text-white text-justify">
              - Les potentiels destinataires qui vous sont proposés sont ceux qui antérieurement ont 
              donnés à un frère ou soeur en Christ le montant que vous aurez choisi.
            </p>
            <p className="text-xl md:text-2xl text-white text-justify">
              - Il n&apos;est pas possible d&apos;avoir à nouveau dans votre liste de personnes à bénir, 
              une qui vous aurez déjà béni ou que vous aurez déjà béni antérieurement.
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
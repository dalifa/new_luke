// Page où est renvoyé celui qui éssaie de se connecté sans avoir été parrainé.
import Link from 'next/link';
//

const Parrainage = async () => {
  //  
  return (
    <div className='h-screen flex items-center justify-center flex-col lg:px-4 bg-indigo-600'>
      <div className='flex flex-col items-center justify-center px-4 lg:px-10 text-lg lg:text-2xl h-4/5 lg:h-3/5 w-4/5 lg:w-2/5 rounded text-center bg-white shadow-xl'>
        <p className='text-indigo-600 text-center text-xl lg:text-3xl mb-6 lg:mb-10'>
          Plateforme en BETA TEST
        </p>
        <p className='leading-relaxed'>Pour l&apos;instant, seules les personnes parrainées, peuvent accéder à la Plateforme pendant le Béta Test.</p>
        <p className='mt-4'>Merci de votre compréhension.</p>
          <Link href={"/logout"}>
            <button className='bg-indigo-600 text-center text-white rounded p-4 mt-10'>Déconnectez-vous</button>
          </Link>
      </div>
    </div>
  )
}
//
export default Parrainage

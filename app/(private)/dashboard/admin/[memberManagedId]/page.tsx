
//
import { auth } from "@/auth"

const MemberManaged = async ({ params }: { params: { memberManagedId: string } }) => {
  // la redirection pour les non connectés est faite depuis le fichier middleware 
  const session = await auth()
  //
  const memberConcerned = await prisma?.profile.findFirst({
    where: { id: params?.memberManagedId}
  })
  //
  return(
    <div className='h-full flex items-center justify-center flex-col space-y-10 px-6 lg:px-0'>
      <div className="w-full text-xl fond-medium lg:w-4/5 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-slate-100 rounded-md shadow-sm gap-y-5 mb-4 border-2 border-slate-200">
        <p>Code PIN: <span className="text-blue-500 font-semibold">{memberConcerned?.codepin}</span></p>
        <p>Prénom: <span className="text-blue-500 font-semibold">{memberConcerned?.firstname}</span></p>
        <p>Account: { memberConcerned?.isActiveAccount === true ? (<span className="text-green-500 font-semibold">ACTIF</span>):(<span className="text-rose-500 font-semibold">INACTIF</span>)}</p>
        <p>Ville: {memberConcerned?.city}</p>
      </div> 
    </div>  
  )
}
//
export default MemberManaged
// Page où est renvoyé celui qui éssaie de se connecté sans avoir été parrainé.
import { CurrentProfile } from '@/hooks/own-current-user';
import { prismadb } from '@/lib/prismadb';
import { decrypt } from '@/lib/utils';
import Link from 'next/link';
//

const Parrainage = async () => {
  const connected = await CurrentProfile()
  //
  const godChildren = await prismadb.sponsorship.findMany({
    where: { parrainId: connected?.id }
  })  
  //
  const godChildrenCount = await prismadb.sponsorship.count({
    where: { parrainId: connected?.id }
  })
  //
  return (
    <div className='h-screen flex items-center justify-center flex-col lg:px-4 bg-indigo-600'>
      <div className='flex flex-col items-center pt-10 px-4 lg:px-10 text-lg lg:text-2xl h-4/5 lg:h-3/5 w-4/5 lg:w-2/5 rounded text-center bg-white shadow-xl'>
        <p className='text-indigo-600 text-center text-xl lg:text-3xl mb-6 lg:mb-10'>
          Email des personnes parrainées par vous. 🙏🏼
        </p>
        <p className='mb-5 font-semibold'>Total: &nbsp;{ godChildrenCount}</p>
        <div className='w-full overflow-auto h-full pb-10'>
          {
            godChildren.map((son) => (
              <p key={son.id} className='text-lg font-semibold mb-2'>
                {decrypt(son?.email)}
              </p>
            ))
          }
        </div>
      </div>
    </div>
  )
}
//
export default Parrainage

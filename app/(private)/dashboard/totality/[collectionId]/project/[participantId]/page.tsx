
import { Card } from '@/components/ui/card';
import { prismadb } from '@/lib/prismadb';
import { currentUserInfos } from '@/hooks/own-current-user';
import { MyProjectForm } from '@/components/dashboard/action-in-collection/myproject-form';
//
const Project = async ({
  params
}: {
  // participantId = le nom du fichier s'il est différent, ça ne marche pas  
  params: { participantId: string } 
  }) => {
    const connected = await currentUserInfos()
    // on selecte la collecte selon params
    const concernedTotality = await prismadb.collection.findFirst({
      where: { id: params.participantId } // ceci est l'id du connecté dans collection
    })
  //
  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <div className='flex w-full p-4 md:w-3/5 lg:w-2/5 items-center justify-center flex-col'>
        <Card className='flex flex-col w-full mt-[20%] p-8 bg-white text-center items-center shadow-md shadow-violet-200'>
          <p className='text-blue-500 text-lg md:text-xl font-semibold'>Projet à faire financer</p>
          <div className='flex flex-col gap-y-1 text-center text-md md:text-lg mb-2 py-5 text-slate-500'>
            <p className='text-sm'>Entrez le projet que vous souhaitez faire financer</p>
            <p className='text-sm'>dans votre collecte Totality n° {concernedTotality?.ownId} de {concernedTotality?.amount}{concernedTotality?.currency}</p>
            <MyProjectForm collectionId={params?.participantId}/>
          </div>
        </Card> 
      </div>
    </div>
  )
}

export default Project
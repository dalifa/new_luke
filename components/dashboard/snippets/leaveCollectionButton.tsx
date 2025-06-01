'use client'


import { leaveCollectionAction } from '@/actions/snippets/leave_collection_Action'
import { useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function LeaveCollectionButton({
  collectionId,
  participantId,
}: {
  collectionId: string
  participantId: string
}) {
  const [isPending, startTransition] = useTransition()

  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      const res = await leaveCollectionAction({
        collectionId,
        participantId,
      }); 

      if (res?.success) {
        router.push('/dashboard'); // redirection côté client
      }
    })
  }  

  return (
    <Dialog>
      <DialogTrigger asChild> 
        <Button className="w-full mt-4 bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-500 disabled:opacity-50">Quitter</Button>
      </DialogTrigger>
      <DialogContent className="w-full flex flex-col items-center justify-center">
        <DialogHeader className='mt-5'>
          <DialogTitle></DialogTitle>
          <DialogDescription className='text-center text-xl text-slate-700'>
            Souhaitez-vous quittez définitivement cette liste ?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className='w-3/5 mt-4'>
        <button
          onClick={handleClick}
          disabled={isPending}
          className="w-full h-12 font-semibold text-xl rounded-lg text-white bg-red-500 hover:bg-red-600"
        >
          {isPending ? 'En cours...' : 'Quitter la liste'} 
        </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveCollectionButton


/*

*/
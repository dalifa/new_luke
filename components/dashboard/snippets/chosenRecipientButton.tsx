'use client'

import { recipientChoiceAction } from '@/actions/snippets/choice_of_recipient_Action'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

import { useTransition } from 'react'

function ChooseRecipientButton({
  collectionId,
  participantId,
  recipientId,
}: {
  collectionId: string
  participantId: string  
  recipientId: string
}) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const res = await recipientChoiceAction({
        collectionId,
        participantId,
        recipientId,
      })

      if (res.success) {
        toast.success('Bénéficiaire choisi', {
            description: 'Votre choix a été enregistré avec succès.',
        })
      } 
    })
  } 

  return (
    <Dialog>
      <DialogTrigger className="text-xl font-semibold mt-4 bg-indigo-600 text-white px-4 py-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
        Choisir comme bénéficiaire
      </DialogTrigger>
      <DialogContent className="w-full flex flex-col items-center justify-center">
        <DialogHeader className='mt-5'>
          <DialogTitle className='text-center mb-5 text-indigo-600 text-2xl'>Personne à bénir</DialogTitle>
          <DialogDescription className='text-center text-xl text-slate-700'>
            <span>NB:</span>&nbsp;Votre choix sera irréverssible
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className='w-3/5 mt-4'>
        <button
          onClick={handleClick}
          disabled={isPending}
          className="w-full p-2 font-semibold text-xl rounded-lg text-white bg-red-500 hover:bg-red-600"
        >
          {isPending ? 'Choix en cours...' : 'Oui, je choisi ce destinataire'} 
        </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
//
export default ChooseRecipientButton

/*

    <button
      onClick={handleClick}
      disabled={isPending}
      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
    >
      {isPending ? 'Choix en cours...' : 'Choisir comme bénéficiaire'} 
    </button>
*/
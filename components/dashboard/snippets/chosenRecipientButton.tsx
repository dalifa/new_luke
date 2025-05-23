'use client'

import { recipientChoiceAction } from '@/actions/snippets/recipient_choice_Action'
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
    <button
      onClick={handleClick}
      disabled={isPending}
      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
    >
      {isPending ? 'Choix en cours...' : 'Choisir comme bénéficiaire'} 
    </button>
  )
}

export default ChooseRecipientButton

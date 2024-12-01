'use client'
  
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
 
// on cliquant l'action qui est dans form  est déclanchée.
export function ConfirmGiveButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" aria-disabled={pending} 
      className="w-full h-full cursor-pointer bg-violet-600
       text-white hover:bg-violet-500"
    >
        Confirmer
    </Button>
  )
}
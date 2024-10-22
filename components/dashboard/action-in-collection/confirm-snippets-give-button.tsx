'use client'
  
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
 
// on cliquant l'action qui est dans form  est déclanchée.
export function ConfirmSnippetsGiveButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" aria-disabled={pending} 
      className="w-full h-full cursor-pointer bg-violet-800
       text-white hover:bg-violet-700"
    >
        Donner 
    </Button>
  )
}
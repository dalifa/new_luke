'use client'
  
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
 
// on cliquant l'action qui est dans form  est déclanchée.
export function ConfirmTriplGiveButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" aria-disabled={pending} 
      className="w-full h-full cursor-pointer bg-red-800
       text-white hover:bg-red-900"
    >
      Donner  
    </Button>
  )
}
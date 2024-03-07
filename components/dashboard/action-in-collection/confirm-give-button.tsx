'use client'
  
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
 
// on cliquant l'action qui est dans form  est déclanchée.
export function ConfirmGiveButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" aria-disabled={pending} 
      className="cursor-pointer bg-blue-800
       text-white text-center rounded p-1 
       md:p-2 hover:bg-green-700"
    >
        Donner avec joie 
    </Button>
  )
}
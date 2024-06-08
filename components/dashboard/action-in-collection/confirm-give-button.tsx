'use client'
  
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
 
// on cliquant l'action qui est dans form  est déclanchée.
export function ConfirmGiveButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" aria-disabled={pending} 
      className="cursor-pointer bg-blue-500
       text-white text-center rounded p-1 
       lg:p-2 hover:bg-blue-600"
    >
        Donner avec joie 
    </Button>
  )
}
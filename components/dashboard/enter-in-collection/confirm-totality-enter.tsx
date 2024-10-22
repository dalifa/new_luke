'use client'
  
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
 
// on cliquant l'action qui est dans form  est déclanchée. 
export function ConfirmTotalityEnter() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" aria-disabled={pending} 
      variant={"blue"}
    >
      Confirmer
    </Button>
  )
}
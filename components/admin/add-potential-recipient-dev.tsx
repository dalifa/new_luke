'use client'
import { recipientForDev } from '@/actions/admin/recipient-for-dev';
// 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
//
export function PotentialForDev() {
  const recipient = recipientForDev.bind(null)
  //  
  return (
    <form action={recipient} className="flex flex-col">
      {/* ce input est un leurre, il ne sert à rien */}
      <Input name="fake" type={"hidden"} placeholder="fake"/>
      <Button variant={"blue"}>
        add recipient
      </Button>
    </form>
  )
}
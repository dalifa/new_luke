'use client'
import { activeInactiveAccount } from '@/actions/admin/active_inactive_member_account';
//
import { Button } from '@/components/ui/button';
//
import { Input } from '@/components/ui/input';
//
export function ActiverInactiveAccount({ memberManagedId }: { memberManagedId: string }) {
  const update = activeInactiveAccount.bind(null, memberManagedId)
  //   
  return (
    <form action={update} className="flex flex-col h-full items-center justify-center gap-y-4 bg-blue-500 rounded-md py-4">
      <p className="text-white text-center text-xl font-medium mb-5">Enable or Disable Account</p>
      {/* ce input est un leurre, il ne sert à rien */}
      <Input name="project" type={"hidden"} placeholder="Ex: billet de train"/>
      <Button type="submit" className="w-4/5 text-xl bg-blue-600 text-white hover:bg-green-600 hover:border-white hover:border-2">
        To Validate
      </Button> 
    </form>
  )
}
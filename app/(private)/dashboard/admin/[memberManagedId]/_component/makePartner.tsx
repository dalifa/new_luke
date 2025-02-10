'use client'
import { makeAndUnmakePartner } from '@/actions/admin/make_member_partner';
import { Button } from '@/components/ui/button';
//
import { Input } from '@/components/ui/input';
//
export function MakePartner({ memberManagedId }: { memberManagedId: string }) {
  const update = makeAndUnmakePartner.bind(null, memberManagedId)
  //   
  return (
    <form action={update} className="flex flex-col h-full items-center justify-center gap-y-4 bg-blue-500 rounded-md py-4">
      <p className="text-white text-center text-xl font-medium mb-5">Make or UnMake Member Partner</p>
      {/* ce input est un leurre, il ne sert à rien */}
      <Input name="project" type={"hidden"} placeholder="Ex: billet de train"/>
      <Button type="submit" className="w-4/5 text-xl bg-blue-600 text-white hover:bg-green-600 hover:border-white hover:border-2">
        To Validate
      </Button> 
    </form>
  )
}
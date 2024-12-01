'use client'

import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { addFakeProfile } from '@/actions/test/add-fake-profile';

export function ToAddFakeProfile() {
  const addfake = addFakeProfile.bind(null)
  //
  return (
    <form action={addfake} className="flex flex-col p-0 border-2 border-pink-500 items-center justify-center">
      {/* ce input est un leurre, il ne sert à rien */}
      <Input name="project" type={"hidden"} />
      <Button variant={"blue"}>Add Fake Profile</Button>
    </form>
  )
}
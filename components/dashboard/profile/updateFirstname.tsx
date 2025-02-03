'use client'
import { updateFirstname } from '@/actions/profile/updateFirstname';
//
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { RefreshCcw } from 'lucide-react';
//
export function UpdateFirstname({ profileId }: { profileId: string }) {
  const update = updateFirstname.bind(null, profileId)
  //  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <RefreshCcw className='w-5 h-5 text-sm text-blue-500 cursor-pointer'/>
      </PopoverTrigger>
      <PopoverContent className="w-70 px-10 ml-10 md:ml-0">
        <form action={update} className="flex flex-col gap-y-4">
          <p className='text-blue-500 text-center text-xl font-medium'>Modifier le Prénom</p>
          <Input name="username" className='w-52 text-center items-center' placeholder="ex: 007"/>
          <PopoverClose className='w-full text-xl text-white h-10 font-medium rounded-md bg-blue-500 hover:bg-blue-400'>
              Valider
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
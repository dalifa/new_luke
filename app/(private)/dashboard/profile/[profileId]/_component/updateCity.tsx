'use client'
import { updateCity } from '@/actions/profile/updateCity';
//
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { Building2 } from 'lucide-react';
//
export function UpdateCity({ profileId }: { profileId: string }) {
  const update = updateCity.bind(null, profileId)
  //  
  return (
    <Popover> 
      <PopoverTrigger asChild>
        <Building2 className='w-5 h-5 text-sm text-blue-500 cursor-pointer'/>
      </PopoverTrigger>
      <PopoverContent className="w-70 px-10 ml-10 md:ml-0">
        <form action={update} className="flex flex-col gap-y-4">
          <p className='text-blue-500 text-center text-xl font-medium'>Changer la Ville</p>
          <Input name="city" className='w-52 text-center items-center' placeholder="ex: Paris"/>
          <PopoverClose className='h-10 font-medium text-xl rounded-md text-white bg-blue-500 w-52 hover:bg-blue-400'>
            <Button variant={"blue"} className='w-full hover:bg-blue-600'>
              Valider
            </Button>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
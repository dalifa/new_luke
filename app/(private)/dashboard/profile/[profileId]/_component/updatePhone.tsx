'use client'
import { updatePhone } from '@/actions/profile/updatePhone';
//
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { Phone} from 'lucide-react';
//
export function UpdatePhone({ profileId }: { profileId: string }) {
  const update = updatePhone.bind(null, profileId)
  //   
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Phone className='w-5 h-5 text-blue-500 cursor-pointer'/>
      </PopoverTrigger>
      <PopoverContent className="w-70 px-10 ml-10 md:ml-0">
        <form action={update} className="flex flex-col gap-y-4">
          <p className='text-blue-500 text-center text-xl font-medium'>Modifier le Portable</p>
          <Input name="phone" className='w-52 text-center items-center text-lg' placeholder="ex: 0600000000"/>
          <PopoverClose className='text-white rounded-md  h-10 text-xl w-52 bg-blue-500 hover:bg-blue-400'>
            <Button variant={"blue"} className='w-full hover:bg-blue-600'>
              Valider
            </Button>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
'use client'
import { updateBio } from '@/actions/profile/updateBio';
import { Button } from '@/components/ui/button';
// 
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import { FileText } from 'lucide-react';
//
export function UpdateBio({ profileId }: { profileId: string }) {
  const update = updateBio.bind(null, profileId)
  //  
  return (
    <Popover> 
      <PopoverTrigger asChild>
        <FileText className='w-5 h-5 text-sm text-blue-500 cursor-pointer'/>
      </PopoverTrigger> 
      <PopoverContent className="w-70 px-10 ml-5 md:ml-0">
        <form action={update} className="flex flex-col gap-y-4">
          <p className='text-blue-500 text-xl text-center font-medium'>Changer la présentation</p>
          <textarea name="bio" className='text-center items-center border border-gray-300 rounded' placeholder="ex: Je suis fan de foot"/>
          <PopoverClose className='w-full h-10 font-medium text-xl rounded-md text-white bg-blue-500 hover:bg-blue-400'>
            <Button variant={"blue"} className='w-full hover:bg-blue-600'>
              Valider
            </Button>
          </PopoverClose>
        </form>
      </PopoverContent>
    </Popover>
  )
}
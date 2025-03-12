'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogDescription } from '@radix-ui/react-dialog';

export function UpdateFieldDialog({
  label,
  placeholder,
  onSubmit,
  icon: Icon,
}: {
  label: string;
  placeholder: string;
  onSubmit: (formData: FormData) => void;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild className='w-7 h-7 p-1 bg-gray-200 rounded-md hover:w-8 hover:h-8'>
        <Icon className='w-5 h-5 text-sm text-red-800 cursor-pointer'/>
      </DialogTrigger>
      <DialogContent className="w-80 md:w-96 px-10 rounded-md">
        <DialogHeader>
          <DialogTitle className='text-lg text-red-800'>{label}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="flex flex-col gap-y-4">
          <Input name="value" className='w-full text-lg text-center items-center' placeholder={placeholder}/>
          <DialogClose className='w-full text-white h-10 font-medium rounded-md bg-red-800 hover:bg-red-900'>
            <Button variant={"primary"} className='w-full text-xl font-medium hover:bg-red-800'>
              Valider
            </Button>
          </DialogClose> 
        </form>
      </DialogContent>
    </Dialog>
  )
}

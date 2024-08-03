"use client";

import { useFormStatus } from 'react-dom'
import { Button } from "@/components/ui/button";
import { responseAction } from '@/actions/responseAction';
//
export const ResponseToQuestion = () => {
  const onClickRespond = () => {
    responseAction();
  };
  //  
  const { pending } = useFormStatus()

  return (
    <Button variant={"blue"} onClick={onClickRespond} type="submit" aria-disabled={pending} className="w-full cursor-pointer text-center rounded p-1 md:p-2">
      Amen !
    </Button> 
  ); 
};

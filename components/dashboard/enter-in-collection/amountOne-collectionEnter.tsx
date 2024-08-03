"use client";

import { useFormStatus } from 'react-dom' 
import { Button } from "@/components/ui/button";
import { amountOneEnterAction } from '@/actions/enter/amountOne-Enter';

interface AmountProps {
  children?: React.ReactNode;
};  
//
export const AmountOneCollectionEnter = ({
  children 
}: AmountProps) => {
  const onClickAmount = () => {
    amountOneEnterAction();
  };
  //   
  const { pending } = useFormStatus()

  return (
    <Button variant={"blue"} onClick={onClickAmount} type="submit" aria-disabled={pending} className="cursor-pointer">
      {children}
    </Button> 
  ); 
};

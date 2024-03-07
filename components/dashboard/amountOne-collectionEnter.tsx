"use client";

import { useFormStatus } from 'react-dom' 
import { Button } from "@/components/ui/button";
import { amountOneEnterAction } from '@/actions/amountOneEnter';

interface AmountOneProps {
  children?: React.ReactNode;
}; 

export const AmountOneCollectionEnter = ({
  children 
}: AmountOneProps) => {
  const onClickAmountOne = () => {
    amountOneEnterAction();
  };
  //   
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClickAmountOne} type="submit" aria-disabled={pending} className="cursor-pointer bg-blue-800 text-white text-center rounded p-1 md:p-2 hover:bg-green-700">
      {children}
    </Button> 
  ); 
};

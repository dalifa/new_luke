"use client";

import { useFormStatus } from 'react-dom' 
import { Button } from "@/components/ui/button";
import { amountOneTotalityEnterAction } from '@/actions/amountOne-TotalityEnter';

interface AmountOneProps {
  children?: React.ReactNode;
};  
//
export const AmountOneTotalityCollectionEnter = ({
  children 
}: AmountOneProps) => {
  const onClickAmountOne = () => {
    amountOneTotalityEnterAction();
  };
  //   
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClickAmountOne} type="submit" aria-disabled={pending} className="cursor-pointer bg-blue-800 text-white text-center rounded p-1 md:p-2 hover:bg-green-700">
      {children}
    </Button> 
  ); 
};

"use client";

import { useFormStatus } from 'react-dom' 
import { Button } from "@/components/ui/button";
import { amountThreeTotalityEnterAction } from '@/actions/amountThree-TotalityEnter';

interface AmountProps {
  children?: React.ReactNode;
};  
//
export const AmountThreeTotalityCollectionEnter = ({
  children 
}: AmountProps) => {
  const onClickAmount = () => {
    amountThreeTotalityEnterAction();
  };
  //   
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClickAmount} type="submit" aria-disabled={pending} className="cursor-pointer bg-blue-500 text-white text-center rounded p-1 md:p-2 hover:bg-blue-600">
      {children}
    </Button> 
  ); 
};

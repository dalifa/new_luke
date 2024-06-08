"use client";

import { useFormStatus } from 'react-dom' 
import { Button } from "@/components/ui/button";
import { amountFourTotalityEnterAction } from '@/actions/amountFour-TotalityEnter';

interface AmountProps {
  children?: React.ReactNode;
};  
//
export const AmountFourTotalityCollectionEnter = ({
  children 
}: AmountProps) => {
  const onClickAmount = () => {
    amountFourTotalityEnterAction();
  };
  //   
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClickAmount} type="submit" aria-disabled={pending} className="cursor-pointer bg-blue-800 text-white text-center rounded p-1 md:p-2 hover:bg-green-700">
      {children}
    </Button> 
  ); 
};

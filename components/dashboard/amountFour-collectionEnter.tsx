"use client";

import { amountFourEnterAction } from "@/actions/amountFourEnter";
import { useFormStatus } from 'react-dom'
import { Button } from "@/components/ui/button";

interface AmountFourProps {
  children?: React.ReactNode;
}; 

export const AmountFourCollectionEnter = ({
  children 
}: AmountFourProps) => {
  const onClickAmountFour = () => {
    amountFourEnterAction();
  };
  //  
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClickAmountFour} type="submit" aria-disabled={pending} className="cursor-pointer bg-blue-800 text-white text-center rounded p-1 md:p-2 hover:bg-green-700">
      {children}
    </Button> 
  ); 
};

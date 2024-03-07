"use client";

import { amountThreeEnterAction } from "@/actions/amountThreeEnter";
import { useFormStatus } from 'react-dom'
import { Button } from "@/components/ui/button";

interface AmountThreeProps {
  children?: React.ReactNode;
}; 

export const AmountThreeCollectionEnter = ({
  children 
}: AmountThreeProps) => {
  const onClickAmountThree = () => {
    amountThreeEnterAction();
  };
  //  
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClickAmountThree} type="submit" aria-disabled={pending} className="cursor-pointer bg-blue-800 text-white text-center rounded p-1 md:p-2 hover:bg-green-700">
      {children}
    </Button> 
  ); 
};

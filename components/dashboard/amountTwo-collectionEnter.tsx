"use client";

import { amountTwoEnterAction } from "@/actions/amountTwoEnter";
import { useFormStatus } from 'react-dom'
import { Button } from "../ui/button";

interface AmountTwoProps {
  children?: React.ReactNode;
};  

export const AmountTwoCollectionEnter = ({
  children 
}: AmountTwoProps) => {
  const onClickAmountTwo = () => {
    amountTwoEnterAction();
  };
  //  
  const { pending } = useFormStatus()

  return (
    <Button onClick={onClickAmountTwo} type="submit" aria-disabled={pending} className="cursor-pointer bg-blue-800 text-white text-center rounded p-1 md:p-2 hover:bg-green-700 w-full">
      {children}
    </Button> 
  ); 
};

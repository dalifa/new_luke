"use client";

import { amount4Totality } from "@/actions/amount4Totality";

interface Amount4TotalityButtonProps {
  children?: React.ReactNode;
};

export const Amount4TotalityButton = ({
  children
}: Amount4TotalityButtonProps) => {
  const onClick4Totality = () => {
    amount4Totality();
  };

  return (
    <div onClick={onClick4Totality} className="cursor-pointer bg-blue-600 text-white text-center rounded p-1 md:p-2 hover:bg-green-700">
      {children}
    </div>
  ); 
};

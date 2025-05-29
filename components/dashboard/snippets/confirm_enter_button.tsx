'use client';

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { enterInSnippetsAction } from "@/actions/snippets/enter_in_collection_action";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ConfirmEnterSnippetsClient({ amountId }: { amountId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      const res = await enterInSnippetsAction(amountId);
      if (res?.success) {
        router.push("/dashboard"); // Redirection client
      }
    });
  };

  return (
    <Button onClick={handleClick} disabled={isPending} variant="primary">
      {isPending ? "En cours..." : "Confirmer"}
    </Button>
  );
}  

/*
'use client'
  
import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
 
// on cliquant l'action qui est dans form  est déclanchée. 
export function ConfirmEnterSnippets() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" aria-disabled={pending} 
      variant={"primary"}
    >
      Confirmer 
    </Button>
  )
}
*/
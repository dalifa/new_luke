"use client";
//
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmTheBlessing } from "@/actions/toBless/commitToBlessing";

export default function ConfirmTheBlessingForm({ amountId, recipientId }: { amountId: string, recipientId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    // Envoyer les deux IDs à la server action
    await ConfirmTheBlessing(amountId, recipientId); 
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Button variant={"blue"} className="w-full" disabled={loading}>
        {loading ? "Traitement..." : "S'engager"}
      </Button>
    </form>
  );
}



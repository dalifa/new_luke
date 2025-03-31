"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function DonorBlessValidation({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  } 

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button variant="blue" className="w-full">J'ai envoyé le don ✅</Button>
      </DialogTrigger>
      <DialogContent className="rounded-md">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-500">Confirmer l'envoi</DialogTitle>
          <DialogDescription className="text-center">Es-tu sûr d'avoir envoyé l'argent via Wero ?</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <Button onClick={handleConfirm} variant="blue" disabled={loading}>
            {loading ? "Confirmation..." : "Oui, j'ai envoyé"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";


export default function RecipientChoice({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  } 

  return (
    <Dialog>
      <DialogTrigger className="w-full font-medium p-3 bg-green-700 hover:bg-green-600 text-white rounded-md text-xl">
        I BLESS YOU
      </DialogTrigger>
      <DialogContent className="rounded-md w-4/5">
        <DialogHeader>
          <DialogTitle className="text-center text-indigo-600 text-xl mb-4">Confirmation</DialogTitle>
          <DialogDescription className="text-center text-slate-600 text-xl">
            Confirmez-vous le choix du destinataire de votre bénédiction ? <br></br>
            Une fois confirmé, vous ne pourrez plus l&apos;annuler.
          </DialogDescription> 
        </DialogHeader>
        <DialogClose className="text-xl text-white p-3 rounded-md bg-red-500 hover:bg-red-400">
          Annuler
        </DialogClose>
        <div className="flex justify-center w-full h-full">
          <Button onClick={handleConfirm} variant="primary" className="w-full text-xl h-14" disabled={loading}>
            {loading ? "Confirmation..." : "Oui, je confirme"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    
  );
}

/*
*/
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";


export default function DonorValidation({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  } 

  return (
    <Dialog>
      <DialogTrigger className="w-full font-medium p-3 bg-green-700 hover:bg-green-600 text-white rounded-md text-xl">
        Confirmer le transfert
      </DialogTrigger>
      <DialogContent className="rounded-md w-4/5">
        <DialogHeader>
          <DialogTitle className="text-center text-indigo-600 text-xl mb-4">Confirmez-vous ?</DialogTitle>
          <DialogDescription className="text-center text-slate-600 text-xl">
            Avoir envoyé l&apos;argent <br/> Et le Donation Number par SMS?
          </DialogDescription> 
        </DialogHeader>
        <DialogClose className="text-xl text-slate-600 border-2 border-gray-300 p-2 rounded-md hover:bg-red-500 hover:text-white hover:border-red-500">
          Annuler
        </DialogClose>
        <div className="flex justify-center w-full">
          <Button onClick={handleConfirm} variant="primary" className="w-full text-xl" disabled={loading}>
            {loading ? "Confirmation..." : "Oui, je confirme"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    
  );
}

/*<Dialog>
      <DialogTrigger className="w-full font-medium p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xl ">J'ai envoyé le don
      </DialogTrigger>
      <DialogContent className="rounded-md">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-500 text-xl mb-4">Confirmez-vous</DialogTitle>
          <DialogDescription className="text-center text-slate-500 text-xl/10">
            avoir envoyé l'argent via Wero ?
            et avoir envoyé par SMS le numéro unique du don à l&apos;intéressé.e ?
          </DialogDescription>
        </DialogHeader>
        <DialogClose className="text-xl text-slate-500 border-2 border-slate-300 p-1 rounded-md hover:bg-red-500 hover:text-white hover:border-red-500">Annuler</DialogClose>
        <div className="flex justify-center w-full">
          <Button onClick={handleConfirm} variant="blue" className="w-full text-xl" disabled={loading}>
            {loading ? "Confirmation..." : "Oui, je confirme"}
          </Button>
        </div>
      </DialogContent>
    </Dialog> */
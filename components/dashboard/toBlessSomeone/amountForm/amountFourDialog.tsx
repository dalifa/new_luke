"use client";
//
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//
import { wishDonationConfirm } from "@/actions/toBless/wish-donation-confirm";
import { TbAlertTriangleFilled } from "react-icons/tb";
//
export default function AmountFourDialog({ amountId }: { amountId: string }) {

  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await wishDonationConfirm(amountId); // ⚡ Exécute l’action serveur et redirige automatiquement
  }
//
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">50€</Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 md:w-2/5 rounded-md">
        <DialogHeader className="flex gap-y-4">
          <DialogTitle className="text-center text-indigo-600">
            Confirmer vouloir donner 50€
          </DialogTitle>
          <DialogDescription className="text-center"></DialogDescription>
          <div className="flex flex-row items-center justify-center py-4 gap-x-4">
            <TbAlertTriangleFilled className="text-orange-500 w-6 h-6"/>
            Votre engagement sera irréversible
          </div>
        </DialogHeader>
        
        {/* FORMULAIRE */} 
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Button variant={"primary"} className="w-full" disabled={loading}>
            {loading ? "Traitement..." : "Je veux bénir"}
          </Button>
        </form>
        <DialogClose className="w-full p-2 text-sm rounded-md border-2 hover:border-red-300 hover:text-rose-500">
          Je renonce
        </DialogClose>
      </DialogContent> 
    </Dialog>
  );
}


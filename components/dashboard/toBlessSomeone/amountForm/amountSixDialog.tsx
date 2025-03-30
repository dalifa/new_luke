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
import { wishDonationConfirm } from "@/actions/toBless/wish-donation-confirm";
import { TbAlertTriangleFilled } from "react-icons/tb";

export default function AmountSixDialog({ amountId }: { amountId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await wishDonationConfirm(amountId); // ⚡ Exécute l’action serveur et redirige automatiquement
  }
//
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">200€</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex gap-y-4">
          <DialogTitle className="text-center text-blue-600">
            Confirmer vouloir donner 200€
          </DialogTitle>
          <DialogDescription className="text-center"></DialogDescription>
          <div className="flex flex-row items-center justify-center py-4 gap-x-4">
            <TbAlertTriangleFilled className="text-orange-500 w-6 h-6"/>
            Votre engagement sera irréversible
          </div>
        </DialogHeader>
        
        {/* FORMULAIRE */} 
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Button variant={"blue"} className="w-full" disabled={loading}>
            {loading ? "Traitement..." : "S'engager"}
          </Button>
        </form>
        <DialogClose className="w-full p-2 text-sm rounded-md border-2 hover:border-red-300 hover:text-rose-500">
            Ne pas s'engager
        </DialogClose>
      </DialogContent> 
    </Dialog>
  );
}


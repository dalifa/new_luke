"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { wishDonationConfirm } from "@/actions/toBless/wish-donation-confirm";

export default function AmountOneDialog({ amountId }: { amountId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    await wishDonationConfirm(amountId); // ⚡ Exécute l’action serveur et redirige automatiquement
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">5€</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex gap-y-4">
          <DialogTitle className="text-center text-blue-600">
            Confirmer le don de 5€
          </DialogTitle>
          <DialogDescription className="text-center">
            Pour voir les bénéficiaires potentiels.
          </DialogDescription>
        </DialogHeader>
        
        {/* FORMULAIRE */} 
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Button variant={"blue"} className="w-full" disabled={loading}>
            {loading ? "Traitement..." : "Confirmer le don"}
          </Button>
        </form>
      </DialogContent> 
    </Dialog>
  );
}

/*
"use client";
//
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
//
export default function AmountOneDialog({ params }: { params: { amountId: string } }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">
          5€
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex gap-y-4">
          <DialogTitle className="text-center text-blue-600">Confirmer le don de 5€</DialogTitle>
          <DialogDescription className="text-center">
            Pour voir les bénéficiaires potentiels.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Link href={`/dashboard/potentialRecipients/${params.amountId}`}>
            <Button variant={"blue"} className="w-full">5€</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

*/

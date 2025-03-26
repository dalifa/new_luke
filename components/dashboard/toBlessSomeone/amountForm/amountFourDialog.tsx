"use client";

import { useEffect, useState } from "react";
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

export default function AmountFourDialog({ params }: { params: { amountId: string } }) {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">
          50€ 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer vouloir donner 50€</DialogTitle>
          <DialogDescription>
            Vous allez sélectionner des bénéficiaires potentiels.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Link href={`/dashboard/potentialRecipients/${params.amountId}`}>
            <Button>50€</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}


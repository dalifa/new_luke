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

export default function AmountFiveDialog({ params }: { params: { amountId: string } }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">
          100€ 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer vouloir donner 100€</DialogTitle>
          <DialogDescription>
            Vous allez sélectionner des bénéficiaires potentiels.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Link href={`/dashboard/potentialRecipients/${params.amountId}`}>
            <Button>100€</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}


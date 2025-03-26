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
export default function AmountTwoDialog({ params }: { params: { amountId: string } }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue">
          10€ 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer vouloir donner 10€</DialogTitle>
          <DialogDescription>
            Vous allez sélectionner des bénéficiaires potentiels.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Link href={`/dashboard/potentialRecipients/${params.amountId}`}>
            <Button>10€</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}


"use client"

import { recipientValidationAction } from "@/actions/snippets/recipientValidation_Action"
import { useState, useTransition } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RecipientValidation({
  collectionId,
  recipientId,
}: {
  collectionId: string
  recipientId: string
}) {
  //const { toast } = useToast()
  const [donationNumber, setDonationNumber] = useState<number | "">("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parsedNumber = Number(donationNumber)
    //
    startTransition(async () => {
      const res = await recipientValidationAction({
        collectionId,
        recipientId,
        donationNumber: parsedNumber,
      })

      if (res?.success) {
        setDonationNumber("")
      } 
    })
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full font-medium p-3 bg-green-700 hover:bg-green-600 text-white rounded-md text-xl">
        Confirmer avoir reçu le don  
      </DialogTrigger>
      <DialogContent className="rounded-md w-4/5">
        <DialogHeader>
          <DialogTitle className="text-center text-indigo-600 text-xl mb-4">Confirmez-vous ?</DialogTitle>
          <DialogDescription className="text-center text-slate-600 text-xl">
            Avoir reçu l&apos;argent
          </DialogDescription> 
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <Input
            type="number"
            placeholder="Entrez le numéro reçu par SMS"
            value={donationNumber}
            onChange={(e) => {
              const val = e.target.value
              setDonationNumber(val === "" ? "" : Number(val))
            }}
            className="text-lg"
          />

          <Button type="submit" disabled={isPending} className="w-full bg-green-600 hover:bg-green-700 text-white text-xl">
            {isPending ? "Confirmation en cours..." : "Valider"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


/*
*/
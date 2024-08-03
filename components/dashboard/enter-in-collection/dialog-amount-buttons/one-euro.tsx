"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { AmountOneCollectionEnter } from "../amountOne-collectionEnter"

export function OneEuroDialog() {
  const router = useRouter()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue" className="w-full">1€</Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 rounded-md md:w-2/5 mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center mb-5 mt-5 text-xl text-blue-500">Confirmation</DialogTitle>
          <DialogDescription>
            <p className="text-lg">Confirmez-vous vouloir participer à une collecte de <span className="text-xl text-blue-500">1€</span> ? </p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <AmountOneCollectionEnter>
            <span className="text-lg font-semibold">Valider 1€</span>
          </AmountOneCollectionEnter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

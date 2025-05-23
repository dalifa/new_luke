"use client";
//
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

//  
export default function RecipientValidation() {

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
        <p>mettre un form ici</p>
        {/* <DialogClose className="text-xl text-slate-600 border-2 border-gray-300 p-2 rounded-md hover:bg-red-500 hover:text-white hover:border-red-500">
          Annuler
        </DialogClose>
        <div className="flex justify-center w-full">
          <Button onClick={handleConfirm} variant="primary" className="w-full text-xl" disabled={loading}>
            {loading ? "Confirmation..." : "Oui, je confirme"}
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}

/*
*/
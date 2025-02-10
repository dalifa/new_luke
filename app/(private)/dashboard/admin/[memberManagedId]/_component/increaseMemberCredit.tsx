"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { increaseMemberCredit } from "@/actions/admin/increase_member_credit";

export function IncreaseMemberCredit({ memberManagedId }: { memberManagedId: string }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null); // État pour stocker l'erreur
  const [success, setSuccess] = useState<string | null>(null); // État pour afficher un succès
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    setError(null); // Réinitialiser l'erreur avant chaque soumission
    setSuccess(null); // Réinitialiser le succès aussi

    const formData = new FormData(event.currentTarget);
    const amountValue = Number(formData.get("amount"));

    if (isNaN(amountValue) || amountValue <= 0) {
      setError("Veuillez entrer un montant valide !");
      return;
    }
    //
    try {
      await increaseMemberCredit(memberManagedId, formData);
      setSuccess(`Crédit augmenté de ${amountValue} `);
      setAmount("");
      formRef.current?.reset();

      // Efface le message de succès après 3 secondes
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message); // Prend le message si c'est une instance d'Error
      } else {
        setError("Une erreur inconnue est survenue."); //Gère les erreurs inattendues
      }
    }
    
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      ref={formRef} 
      className="flex flex-col items-center justify-center gap-y-4 bg-blue-500 rounded-md py-4"
    >
      <p className="text-white text-center text-xl font-medium">Member Credit</p>

      <Input
        type="number"
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-4/5 text-center"
        placeholder="ex: 10"
        //required
      />

      {/* Affichage de l'erreur si elle existe */}
      {error && <div className="text-red-500 text-sm p-2 rounded-md bg-white w-4/5">{error}</div>}

      {/* Affichage du succès si tout va bien */}
      {success && <div className="text-green-500 text-sm p-2 rounded-md bg-white">{success}</div>}

      <Button type="submit" className="w-4/5 text-xl bg-blue-600 text-white hover:bg-green-600 hover:border-white hover:border-2">
        Increase
      </Button>
    </form>
  );
}


/*


*/
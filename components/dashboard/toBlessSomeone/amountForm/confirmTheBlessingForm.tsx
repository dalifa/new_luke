"use client";
//
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmMyBlessing } from "@/actions/toBless/confirmMyBlessing";
//
export default function ConfirmTheBlessingForm({ amountId, recipientId }: { amountId: string, recipientId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    console.log("Appel de la Server Action...");
    const redirectUrl = await ConfirmMyBlessing(amountId, recipientId);
  
    console.log("Server Action a retourné :", redirectUrl);
  
    if (redirectUrl) {
      console.log("Redirection vers", redirectUrl);
      router.push(redirectUrl);
    } else {
      console.log("Aucune URL de redirection reçue.");
      setLoading(false);
    }
  }
  //
  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Button variant={"blue"} className="w-full text-xl" disabled={loading}>
        {loading ? "Traitement..." : "I Bless You"}
      </Button> 
    </form>
  );
}


/* "use client";
//
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmMyBlessing } from "@/actions/toBless/confirmMyBlessing";

export default function ConfirmTheBlessingForm({ amountId, recipientId }: { amountId: string, recipientId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    // Envoyer les deux IDs à la server action 
    await ConfirmMyBlessing(amountId, recipientId);  
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <Button variant={"blue"} className="w-full text-xl" disabled={loading}>
        {loading ? "Traitement..." : "I Bless You"}
      </Button>
    </form>
  );
}
*/

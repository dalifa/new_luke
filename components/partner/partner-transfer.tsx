"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  usercodepin: z.coerce.number().min(4, {
    message: "Le user Code"
  }),
  transferCode: z.coerce.number().min(1, {
    message: "Entrez le transfert Code"
  }), 
});

// le partenaire enregistre la cagnotte qu'il va remetrre au membre
const PartnerTransferForm = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const toastMessage = 'Montant du transfert enregistré avec succès!';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // quand il y a des chiffre (Int) il faut ajouté: useForm<z.infer<typeof formSchema>>
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usercodepin: 0,
      transferCode: 0 
    }
  });

  const isLoading = form.formState.isSubmitting;
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch("/api/partner/register-a-transfer", values);

      form.reset();
      router.refresh(); 
      window.location.reload();
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong.');
    }
    //
  }

  if (!isMounted) {
    return null;
  }

    return (
      <div>
        formulaire pour entrer le montant qu&apos;un partenaire transfert vers un membre
      </div>
    )
}

export default PartnerTransferForm
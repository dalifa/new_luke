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
    message: "Le code pin"
  }),
  amountToCredit: z.coerce.number().min(1, {
    message: "Entrez le montant à créditer"
  }),
});

// le partenaire credite le compte d'un membre
const PartnerCreditForm = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const toastMessage = 'Compte crédité avec succès!';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // quand il y a des chiffre (Int) il faut ajouté: useForm<z.infer<typeof formSchema>>
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usercodepin: 0,
      amountToCredit: 0,
    }
  });

  const isLoading = form.formState.isSubmitting;
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch("/api/partner/credit-a-compte", values);

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
        formulaire pour créditer le compte d&apos;un membre par un partenaire
      </div>
    )
}

export default PartnerCreditForm
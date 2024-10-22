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
    amountToRecover: z.coerce.number().min(1, {
    message: "Entrez le montant à transférer"
  }),
});

const TransferDemandForm = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const toastMessage = 'Transfert éffectué avec succès!';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // quand il y a des chiffre (Int) il faut ajouté: useForm<z.infer<typeof formSchema>>
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amountToRecover: 0, // recover = récupérer
    }
  });

  const isLoading = form.formState.isSubmitting;
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/profile/transfer-demand", values);

      form.reset();
      router.refresh();
      window.location.reload(); 
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong.');
    }
  }

  if (!isMounted) {
    return null;
  }

    return (
      <div>
        <div className="bg-white text-indigo-900 p-0 w-full">    
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-3 px-3">
                {/* somme à transférer */} 
                <FormField
                  control={form.control}
                  name="amountToRecover"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500 text-sm">
                      Montant à retirer
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isLoading}
                        className="bg-blue-100/50 h-10 text-md border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Montant à retirer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="px-3 py-2 border-6 border-white">
                <Button variant="blue" disabled={isLoading} className="w-full h-12 text-md font-semibold text-white">
                  Demander
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
}

export default TransferDemandForm
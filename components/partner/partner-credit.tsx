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
        <div className="bg-transparent text-indigo-900 p-5 rounded w-full">    
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2 px-4">
                {/* lukecode du membre */} 
                <FormField
                  control={form.control}
                  name="usercodepin"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-400 text-sm">Code PIN</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isLoading}
                        className="bg-blue-300 h-12 border-0 focus-visible:ring-0 text-slate-700 font-semibold  text-lg focus-visible:ring-offset-0"
                        placeholder="Le Code PIN"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
                {/* somme à créditer */} 
                <FormField
                  control={form.control}
                  name="amountToCredit"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-400 text-sm">Montant à Créditer</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isLoading}
                        className="bg-blue-300 h-12 border-0 focus-visible:ring-0 text-slate-700 font-semibold text-lg focus-visible:ring-offset-0"
                        placeholder="Montant à créditer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="px-3 py-3 border-8 border-transparent">
                <Button variant="blue" disabled={isLoading} className="w-full h-14 text-lg font-semibold text-white">
                  Créditer
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
}

export default PartnerCreditForm
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
  amount: z.coerce.number().min(1, {
    message: "Entrez un montant"
  }),
  currency: z.string().toLowerCase().min(1, {
    message: "currency signe."
  }),
  rank: z.string().toLowerCase().min(1, {
    message: "rank."
  }),
});

const EnterAmount = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const toastMessage =  'Rate commission updated successfully!';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // quand il y a des chiffre (Int) il faut ajouté: useForm<z.infer<typeof formSchema>>
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      currency: "",
      rank: ""
    }
  });

  const isLoading = form.formState.isSubmitting;
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/admin/create-amount", values);

      form.reset();
      //router.refresh();
      //window.location.reload();
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
        <div className="bg-white text-blue-800 p-0 w-full border-2 border-blue-800">    
          <div className="pt-10 px-6">
            <div className="text-lg lg:text-xl text-center font-bold mb-5"> 
              Add Amount by currency
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-6 px-6">
                {/* amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>La somme</FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                          disabled={isLoading}
                          className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>La monnaie</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="monnaie"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Le rang</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="rank"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="px-6 py-4 border-8 border-white">
                <Button variant="blue" disabled={isLoading} className="w-full h-12 text-md">
                  Enter
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
}

export default EnterAmount 
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
  amount: z.string().toLowerCase().min(1, {
    message: "amount."
  }),
  cent1: z.coerce.number().min(1, {
    message: "cent1"
  }),
  cent2: z.coerce.number().min(1, {
    message: "cent1"
  }),
  byten: z.coerce.number().min(1, {
    message: "by ten"
  }),
});

const EnterCents = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const toastMessage =  'added successfully!';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // quand il y a des chiffre (Int) il faut ajouté: useForm<z.infer<typeof formSchema>>
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      cent1: 0,
      cent2: 0,
      byten:0

    }
  });

  const isLoading = form.formState.isSubmitting;
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/admin/enter-cents", values);

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
            <div className="text-lg md:text-xl text-center font-bold mb-5"> 
              Enter Cents
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
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="amount in string"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
                {/* cent1 */}
                <FormField
                  control={form.control}
                  name="cent1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>first digit</FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="cent1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* cent2 */}
                <FormField
                  control={form.control}
                  name="cent2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>second digit</FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="cent2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* use zone */}
                <FormField
                  control={form.control}
                  name="byten"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>multiplied byten</FormLabel>
                      <FormControl>
                        <Input
                        type="number"
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="by ten"
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
                  ADD CENTS
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
}

export default EnterCents
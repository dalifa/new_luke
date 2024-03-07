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
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  rate: z.coerce.number().min(1, {
    message: "Entrez le pourcentage"
  }),
});

const RateCommission = () => {
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
      rate: 0
    }
  });

  const isLoading = form.formState.isSubmitting;
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // await axios.post("/api/admin/create-update-rate", values);
      await axios.patch("/api/admin/create-update-rate", values);

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
            <div className="text-md text-center font-bold mb-5"> 
              Update Rate commission
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-6 px-6">
                {/* rate */}
                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                        type="number"
                          disabled={isLoading}
                          className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="taux de commission"
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
                  Update
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
}

export default RateCommission
"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Metric } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const formSchema = z.object({
  currentgroup: z.coerce.number().min(1, {
    message: "current Group."
  }),
  currentNbrOfCollection: z.coerce.number().min(1, {
    message: "current nbre of collection"
  }),
});

type MetricFormValues = z.infer<typeof formSchema>

interface MetricProps{
  //
  initialData: Metric | null,
}

// pour faire l'anti slash faire shift + option + slash \\
export const MetricForm : React.FC <MetricProps> = ({
  initialData,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastMessage = initialData ? 'Metric mise à jour.' : 'Metric enregistrée.';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    currentgroup: 0,
    currentNbrOfCollection: 0,
  }

  const form = useForm<MetricFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      currentgroup: 0,
      currentNbrOfCollection: 0,
    } 
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: MetricFormValues ) => {
    try {
      setLoading(true);
      // la difference c'est patch et post même si la route est la même
      if (initialData) {
        await axios.patch("/api/admin/create-or-update-metric", data);
      } else {
        await axios.post("/api/admin/create-or-update-metric", data);
      }
      //form.reset(); 
      router.refresh();
      //window.location.reload();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
  }

  return (
    <div className="flex w-full">
      <div className="bg-white text-blue-800 p-0 w-full border-2 border-blue-800">
        
        <div className=" flex  flex-col pt-5 px-6 items-center justify-center">
          <div className="text-lg md:text-xl text-blue-800 text-center font-bold mb-5">
            {initialData ? ("Update "): ("Enter ")}
              métrics
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6 px-6">
              {/* current group */}
              <FormField
                control={form.control}
                name="currentgroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Group</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Current group"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* current nbre of collection */}
              <FormField
                control={form.control}
                name="currentNbrOfCollection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nbr of collections</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="current nbr of collection"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="px-4 py-4 rounded border-8 border-white">
              <Button variant={"success"} disabled={isLoading} className="w-full h-12 md:h-14 text-xl text-white">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
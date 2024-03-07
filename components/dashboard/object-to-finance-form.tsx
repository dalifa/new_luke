// OBJECT A FINANCER
"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MyObject, ToFinance } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select" 

const formSchema = z.object({
  objectToFinanceId: z.string().toLowerCase().min(1, {
    message: "Project à financer?"
  }),
});

type ProjectFormValues = z.infer<typeof formSchema>

interface ProjectProps{
  // c'est l'import depuis @prisma/client
  initialData: MyObject | null,
  objectToFinances: ToFinance[],
}

// pour faire l'anti slash faire shift + option + slash \\
export const ProjectToFinanceForm : React.FC <ProjectProps> = ({
  initialData,
  objectToFinances
}) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastMessage = initialData ? 'Projet à financer enregistré' : 'Projet à faire financer renouvellé.';

  const defaultValues = initialData ? {
    ...initialData,
    objectToFinances
  } : {
    objectToFinanceId: "",
  }

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      objectToFinanceId: "",
    } 
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: ProjectFormValues ) => {
    try {
      setLoading(true);
      // la difference c'est patch et post même si la route est la même
      if (initialData) {
        await axios.patch("/api/profile/object-to-finance", data);
      } else {
        await axios.post("/api/profile/object-to-finance", data);
      }
      //form.reset(); 
      router.refresh();
      window.location.reload();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
      } finally {
        setLoading(false);
      }
  }

  return (
    <div className="flex w-full">
      <div className="bg-white rounded w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <div className="w-full space-y-2">
                <p className="text-slate-500 text-sm">Choisir un projet à faire financer</p>
                {/* objet à financer */} 
                <FormField
                  control={form.control}
                  name="objectToFinanceId"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-100/50 border-0 text-xs focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                            <SelectValue defaultValue={field.value} placeholder="Choisir"/>
                          </SelectTrigger>
                        </FormControl>
                        
                        <SelectContent className="bg-white h-52 pb-2">
                          {objectToFinances.map((objectToFinance) => (
                            <SelectItem key={objectToFinance.id} value={objectToFinance.id} className="hover:bg-blue-100/60 text-sm">{objectToFinance.objectName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="rounded">
              <Button variant={"success"} disabled={isLoading} className="w-full h-10 text-sm text-white">
                Valider
              </Button>
              </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
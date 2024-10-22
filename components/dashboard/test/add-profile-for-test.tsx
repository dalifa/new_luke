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
  username: z.string().toLowerCase().min(1, {
    message: "username."
  }),
  phone: z.string().toLowerCase().min(1, {
    message: "username."
  }),
  firstname: z.string().toLowerCase().min(1, {
    message: "username."
  }),
  lastname: z.string().toLowerCase().min(1, {
    message: "username."
  }),
  city: z.string().toLowerCase().min(1, {
    message: "username."
  }),
  bio: z.string().toLowerCase().min(1, {
    message: "username."
  }),
});

const AddFakeProfile = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const toastMessage =  'profile test added successfully!';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // quand il y a des chiffre (Int) il faut ajouté: useForm<z.infer<typeof formSchema>>
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "", 
      firstname: "",    
      lastname: "",    
      city: "",
      bio: "", 
    }
  });

  const isLoading = form.formState.isSubmitting;
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/test/add-fake-profile", values);

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
              Add profile for test
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-6 px-6">
                {/* profile Id */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="phone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="firstname"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="lastname"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="city"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="bio"
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
                  Add fake profil
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    )
}

export default AddFakeProfile
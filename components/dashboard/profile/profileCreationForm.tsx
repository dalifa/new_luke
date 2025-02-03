// 2025
"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateProfileSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,  
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountryOptions } from "@/constants";
import { FormError } from "@/components/dashboard/profile/form-error";
import { Textarea } from "@/components/ui/textarea";
import { createProfile } from "@/actions/profile/create_profile";
//
export const CreateProfile = () => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CreateProfileSchema>>({
    resolver: zodResolver(CreateProfileSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      phone: "",
      city: "",
      country: "",
      bio: ""
    },
  });

  const onSubmit = (values: z.infer<typeof CreateProfileSchema>) => {
    setError("");
    //
    startTransition(() => {
      createProfile(values)
        .then((data) => {
          setError(data?.error);
        });
    });
  };

  return (
    <div className="w-3/5">
      <div className="mb-10 space-y-4">
        <p className="text-blue-500 text-xl text-center">Renseignez votre profil</p>
      </div>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* prénom */}
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Prénom <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="ex: Fils"
                      className="bg-violet-200/50 text-md hover:bg-neutral-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Nom */}
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Nom <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="ex: De Dieu"
                      className="bg-violet-200/50 text-md hover:bg-neutral-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Pseudo <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="ex: Christos"
                      className="bg-violet-200/50 text-md hover:bg-neutral-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Téléphone Portable <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="ex:0600000000"
                      className="bg-violet-200/50 text-md hover:bg-neutral-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ville */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Ville d&apos;habitation <span className="text-red-600">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="ex: Croissy"
                      className="bg-violet-200/50 text-md hover:bg-neutral-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Pays d&apos;habitation <span className="text-red-600">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-violet-200/50 hover:bg-neutral-50 text-md text-slate-500 border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                        <SelectValue  defaultValue={field.value} placeholder="ex: France"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {CountryOptions.map((option:any) => (
                        <SelectItem key={option} value={option} className="hover:bg-violet-200/50 text-violet-900 text-md hover:text-violet-500">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Un petit mot sur vous ?</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isPending}
                      className="bg-violet-200/50 hover:bg-neutral-50 text-md"
                      placeholder="Ex: Je sers au ministère de la louange"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <Button
            disabled={isPending}
            type="submit"
            variant={"blue"}
            className="w-full h-14 text-xl"
          >
            Valider
          </Button>
        </form>
      </Form>
    </div>
  );
};
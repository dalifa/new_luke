// SANS LE CHAMPS PHOTO
"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Profile, Country } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  username: z.string().toLowerCase().max(12, {
    message: "12 caractères max."
  }),
  phone: z.string().toLowerCase().min(1, {
    message: "Votre numéro de portable."
  }),
  firstname: z.string().toLowerCase().min(1, {
    message: "Votre prénom."
  }),
  lastname: z.string().toLowerCase().min(1, {
    message: "Votre nom."
  }),
  city: z.string().toLowerCase().min(1, {
    message: "Votre ville d'habitation."
  }),
  countryId: z.string().toLowerCase().min(1, {
    message: "Pays d'habitation."
  }),
  bio: z.string().min(1, {
    message: "Entrez un petit mot sur vous."
  }).max(100),
});

type ProfileFormValues = z.infer<typeof formSchema>

interface ProfileProps{
  // c'est l'import UserInfos depuis @prisma/client
  initialData: Profile | null,
  countries: Country[],
}

// pour faire l'anti slash faire shift + option + slash \\
export const ProfileInfosForm : React.FC <ProfileProps> = ({
  initialData,
  countries
}) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toastMessage = initialData ? 'Profil mis à jour.' : 'Profil enregistré.';

  const defaultValues = initialData ? {
    ...initialData,
    countries
  } : {
    // il me faudra trouver comment représenter ici dans defaultValues
    // des champ qui sont optionnels.
    // ### très intéressant: mettre new Date() en defaultValues lorsqu'on utilise date picker de shad/ui ####
    // birthDate: new Date(),
    //photo: "",
    username: "",
    phone: "",
    firstname: "",
    lastname: "",
    city: "",
    countryId: "",
    bio: ""
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      username: "",
      phone: "",  // il faut mettre un chiffre lorsque c'est un Int sinon erreur
      firstname: "",
      lastname: "",
      city: "",
      countryId: "",
      bio: ""
    } 
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: ProfileFormValues ) => {
    try {
      setLoading(true);
      // la difference c'est patch et post même si la route est la même
      if (initialData) {
        await axios.patch("/api/profile/create-or-update-profile", data);
      } else {
        await axios.post("/api/profile/create-or-update-profile", data);
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
    <div className='w-full h-full flex items-center justify-center flex-col pt-2 lg:pt-10 gap-10'>
      <div className="bg-white border rounded p-0 md:p-5 w-4/5 md:w-3/5 lg:w-2/5 shadow-md mx-5 my-8 shadow-blue-100">
        <div className=" flex  flex-col pt-5 px-6 items-center justify-center">
          <div className="text-lg md:text-xl text-blue-500 text-center font-bold mb-10">
            {initialData ? ("Modifier "): ("Renseigner ")}
              vos infos de profil
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className=" space-y-8 px-5 md:px-0">
              <div className="w-full space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* pseudo */}
                <FormField
                  control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pseudo</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Pseudo"
                        {...field}
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
                      <FormLabel>N° de portable</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="N° portable"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* firstname */}
                <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Prénom"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
                {/* lastname */}
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Nom"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* city */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Ville d'habitation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* country */}
              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                          <SelectValue defaultValue={field.value} placeholder="Pays d'habitation"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id} className="hover:bg-blue-100/50">{country.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
              
                {/* BIO */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Un petit mot sur vous</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        disabled={isLoading}
                        className="bg-blue-100/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Un petit mot sur vous"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )}
                />
              </div>
              
            </div>
            <div className="px-4 pb-10 rounded border-8 border-white">
              <Button variant={"blue"} disabled={isLoading} className="w-full h-12 md:h-14 text-xl text-white">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
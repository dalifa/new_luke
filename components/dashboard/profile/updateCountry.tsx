'use client';
//
import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { HandPlatter } from "lucide-react";
import { updateTheCountry } from "@/actions/profile/update_Country";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose, PopoverContent } from "@radix-ui/react-popover";
import { capitalize } from "@/hooks/own-current-user";
//  
export function UpdateCountry({ allCountries, profileId }: {
  allCountries: { value: string; label: string }[];
  profileId: string;
}) {
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const chosenCountry = formData.get("country") as string;

    // Appelez la server action pour mettre le pays
    await updateTheCountry(profileId, chosenCountry);
  };
  //
  return (
    <Popover>
      <PopoverTrigger asChild>
        <HandPlatter className="text-blue-500 cursor-pointer"/>
      </PopoverTrigger>
      <PopoverContent className="w-70 px-10 py-4 ml-10 md:ml-0 bg-white rounded-md shadow-md shadow-slate-400">
          <p className="text-center text-xl text-blue-500 font-medium">Pays d&apos;habitation</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 mt-4 bg-white">
          <select
            name="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="flex flex-col w-full space-y-10 border border-gray-300 rounded px-2 py-2"
          >
            <option value="">Sélectionnez votre pays</option>
            {allCountries.map((country) => (
              <option key={country.value} value={country.value}>
                {capitalize(country.label)}
              </option>
            ))}
          </select> 
          <PopoverClose className="text-xl h-10 font-medium mt-2 p-2 bg-blue-500 hover:bg-blue-400 text-white rounded">
            Choisir
          </PopoverClose> 
        </form>
      </PopoverContent>
    </Popover>
  );
}
/*
*/
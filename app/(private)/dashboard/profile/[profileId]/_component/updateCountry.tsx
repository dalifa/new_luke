'use client';
//
import { useState } from "react";
import { Globe, HandPlatter } from "lucide-react";
import { changeCountry } from "@/actions/profile/update_Country";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverClose, PopoverContent } from "@radix-ui/react-popover";
import { capitalize } from "@/hooks/own-current-user";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
    await changeCountry(profileId, chosenCountry);
  };
  //
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Globe className="text-blue-500 cursor-pointer"/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">Pays d&apos;habitation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 mt-4">
          <select
            name="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border border-gray-300 rounded px-2 py-2"
          >
            <option value="">Sélectionnez un Pays</option>
            {allCountries.map((country) => (
              <option key={country.value} value={country.value}>
                {capitalize(country.label)}
              </option>
            ))}
          </select>
          <DialogClose className="w-full">
          <button type="submit" className="mt-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Choisir
          </button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
//
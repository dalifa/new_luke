'use client'

import { Button } from "@/components/ui/button"
import { Input } from '../ui/input';
import { addCountryCurrency } from '@/actions/test/add-country-currency';

export function AddCountryAction() {
  const enterCountry = addCountryCurrency.bind(null)
  //
  return (
    <form action={enterCountry} className="flex flex-col gap-y-5 p-2">
      <Input name="name" placeholder="Ex: France" className="h-12 bg-violet-200 text-slate-600 rounded"/>
      <Input name="currency" placeholder="Ex: €" className="h-12 bg-violet-200 text-slate-600 rounded"/>
      <Input name="usezone" placeholder="Ex: euro" className="h-12 bg-violet-200 text-slate-600 rounded"/>
      <Button variant={"violet"} className="h-12">Add Country</Button>
    </form>
  )
}

/*
*/
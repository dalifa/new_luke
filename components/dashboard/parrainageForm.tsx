import { parrainage } from "@/actions/sponsorship/parrainage";


// components/ParrainageForm.tsx
export default function ParrainageForm() {
  return (
    <form action={parrainage} className="space-y-4 lg:w-3/5">
      <input
        type="email"
        name="email"
        required
        placeholder="Adresse Gmail"
        className="p-2 border rounded w-full text-center"
      />
      <button
        type="submit"
        className="bg-blue-600 w-full text-white px-4 py-2 rounded"
      >
        Enregistrer
      </button>
    </form>
  );
}

/*
*/
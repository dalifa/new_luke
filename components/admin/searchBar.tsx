"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { searchUser } from "@/actions/admin/search";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; firstname: string; codepin: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      const users = await searchUser(query);
      setResults(users.slice(0, 4)); // Limite à 4 résultats
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(fetchUsers, 300); // Débouncer pour éviter trop d'appels
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-md border-2 rounded-md border-blue-500">
      <Input
        type="number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Entrez un codepin"
        className="w-full p-2 border rounded"
      />

      {loading && <p className="text-gray-500 text-sm mt-1">Recherche...</p>}

      {results.length > 0 && (
        <ul className="absolute z-10 shadow-lg w-full mt-2 rounded-md border bg-blue-50">
          {results.map((user) => (
            <li
              key={user.id}
              onClick={() => router.push(`/dashboard/admin/${user.id}`)}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-none"
            >
              {user.firstname} - {user.codepin}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


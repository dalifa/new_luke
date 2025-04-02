"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { recipientValidation } from "@/actions/toBless/recipient-validation";

export default function ValidateDonationForm({ recipientId }: { recipientId: string }) {
  const [donationNumber, setDonationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await recipientValidation(donationNumber, recipientId);

    if (response?.error) {
      setError(response?.error);
    }

    setLoading(false);
  }

  return (
    //fixed top-5 left-0 w-full bg-white p-4 shadow-md z-10"
    <div className="">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="text"
          value={donationNumber}
          onChange={(e) => setDonationNumber(e.target.value)}
          placeholder="Entrez le donation number"
          className="border p-2 rounded-md w-full"
          required
        />
        <Button type="submit" variant="blue" disabled={loading}>
          {loading ? "Validation..." : "Valider"}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

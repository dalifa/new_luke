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
    <div className="p-6 bg-white shadow-xl rounded-lg">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="text"
          value={donationNumber}
          onChange={(e) => setDonationNumber(e.target.value)}
          placeholder="Entrez le donation number"
          className="border p-3 rounded-md w-full"
          required
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Validation..." : "Valider"}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

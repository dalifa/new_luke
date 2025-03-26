"use client";
//
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getRecipientDetail } from "@/actions/toBless/recipientChosen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
//
export default function RecipientDetail({ listId }: { listId: string }) {
  const [recipient, setRecipient] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getRecipientDetail(listId);
      setRecipient(data);
    }
    fetchData();
  }, [listId]);

  if (!recipient) return <p className="text-center text-gray-500">Chargement...</p>;

  return (
    <Card className="bg-white shadow-blue-100 shadow-md p-4">
      <h2 className="text-center mb-4 font-semibold text-slate-600 text-xl">
        Détails du bénéficiaire choisi
      </h2>
      <hr className="w-full mb-4" />
      <Avatar className='h-20 w-20 lg:h-24 lg:w-24'>
        <AvatarImage src={recipient?.googleImage}/>
        <AvatarFallback className="bg-blue-500">
          <UserRound className="text-white h-14 w-14"/>
        </AvatarFallback>
      </Avatar>
      <p className="text-lg font-semibold text-blue-500">
        {recipient.firstname}
      </p>
      <p className="text-gray-500">{recipient.city}, {recipient.country}</p>
      <p className="text-gray-500">Téléphone : {recipient.hashedPhone}</p>
      <p className="text-gray-500 font-semibold">Numéro de don : {recipient.donationNumber}</p>
    </Card>
  );
}

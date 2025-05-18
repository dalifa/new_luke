
import { prismadb } from "@/lib/prismadb";
import { CurrentProfile } from "@/hooks/own-current-user";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// TOUTES LES COLLECTES DANS LESQUELLES FIGURE LE CONNECTE
export const MyCollections = async () => {
  const connected:any = await CurrentProfile()
  //
  const myCollections = await prismadb.collectionParticipant.findMany({
    where: {
      participantId: connected?.id,
      recipientValidation: false
    }
  })
  //
  return ( 
    <Card className="bg-white shadow-xl p-6 rounded-lg">
      <p className="text-center mb-3 text-xl font-semibold text-gray-700">VOS LISTES DE BÉNÉDICTIONS</p>
      <hr className="border-t border-gray-300 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* collectes non cloturé */}  
        {myCollections.map((collecte) => (
          <div key={collecte.id} className="rounded-md bg-green-600">
            <Link href={`/dashboard/snippets/myCollections/${collecte?.collectionId}`}>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {collecte?.concernedAmount}{connected?.currency}
              </Button>
            </Link> 
          </div>
        ))}
      </div>
    </Card>
  ); 
};


/*

*/
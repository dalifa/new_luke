"use client"
//
import { blessRecipient } from "@/actions/toBless/blessRecipient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { getPotentialRecipients } from "@/actions/toBless/wish-donation-confirm";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/hooks/own-current-user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
//
export default function PotentialRecipientPage({ amountId }: { amountId: string }) {  
  // Récupérer les bénéficiaires potentiels en fonction du montant choisi
  const [lists, setLists] = useState<any[]>([]);
  //
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPotentialRecipients(amountId);
        if (Array.isArray(data)) {
          setLists(data); // On s'assure que `data` est bien un tableau avant de l'utiliser
        } else {
          setLists([]); // Si `data` est `undefined` ou invalide, on met un tableau vide
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des bénéficiaires :", error);
        setLists([]); // Sécurité en cas d'erreur API
      }
    }
    fetchData();
  }, [amountId]);
  //
  //
  return (
    <Card className="bg-white shadow-blue-100 shadow-md p-4 m-4">
      <h2 className="text-center mb-4 font-semibold text-slate-700 text-xl">
        Bénéficiaires potentiels
      </h2>
      <hr className="w-full mb-4" />

      {lists.length === 0 ? (
        <p className="text-center text-gray-500">Aucun bénéficiaire pour ce montant.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {lists.map((list) => (
            <div key={list.id}>
              <h3 className="text-lg font-semibold text-blue-600 text-center mb-2">
                Liste de don #{list.id.slice(-6)} {/* Affichage d’un identifiant unique pour différencier */}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {list?.potentialRecipients.map((potential:any) => (
                  <Card key={potential?.id} className="flex flex-col items-center p-4 text-xl gap-3">
                    <Avatar className='h-20 w-20 lg:h-24 lg:w-24'>
                      <AvatarImage src={potential?.recipient?.googleImage}/>
                      <AvatarFallback className="bg-blue-500">
                        <UserRound className="text-white h-14 w-14"/>
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xl capitalize font-semibold text-blue-500">{potential?.recipient?.username}</p>
                    <p className="break-words"> {capitalize(potential?.recipient?.bio)}</p>
                    <p className="text-gray-500">{capitalize(potential?.recipient?.city)}</p>
                    <p>{capitalize(potential?.recipient?.country)}</p>
                    <Dialog >
                      <DialogTrigger className="w-3/5">
                          <Button variant={"blue"} className="w-3/5 text-xl">Bless {potential?.amount}{potential?.recipient?.currency}</Button>
                      </DialogTrigger>
                      <DialogContent className="w-4/5 rounded-md">
                        <DialogHeader className="flex flex-col gap-4 mb-4">
                            <DialogTitle className="text-center text-blue-500">Décider librement de donner {potential?.amount}{potential?.recipient?.currency}</DialogTitle>
                            <DialogDescription className="text-center">Votre choix sera irréversible</DialogDescription>
                        </DialogHeader>
                        <form action={blessRecipient} className="flex flex-col items-center">
                          <input type="hidden" name="recipientId" value={potential.recipient?.id} />
                          <input type="hidden" name="amountId" value={amountId} />
                          <button className="bg-blue-500 text-white text-xl px-4 py-1 rounded-md">
                            Bless {capitalize(potential?.recipient?.username)}
                          </button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}



/*
  return (
    <div className=" w-full md:w-4/5 mx-auto p-4 bg-white shadow-md rounded-md mt-4 md:mt-10">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-600">Bénéficiaires Potentiels de vos €</h2>
      <ul className="space-y-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {lists.map(({ list }) => (
          <li key={list.id} className="p-3 gap-4 border rounded-md flex flex-col">
            <div>
              {
                list.potentialRecipients.map((profile:any) => (
                  <div key={profile?.id}>
                  <div className="flex flex-col gap-4 items-center">{profile.recipient.googleImage && (
                    <Avatar className='h-14 w-14 lg:h-18 lg:w-18'>
                      <AvatarImage src={profile?.recipient.googleImage}/>
                        <AvatarFallback className="bg-blue-500">
                          <UserRound className="text-white h-14 w-14"/>
                        </AvatarFallback>
                    </Avatar>
                  )}
                  </div>
                  <div>
                  <p className="font-semibold text-center">{capitalize(profile?.recipient?.username)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <p>{capitalize(profile?.recipient?.city)}</p>
                    <p className="break-words">{capitalize(profile?.recipient?.bio)}</p>
                  </div>
                  <div>
                    <form action={blessRecipient} className="flex flex-col items-center">
                      <input type="hidden" name="recipientId" value={profile.recipient?.id} />
                      <input type="hidden" name="amountId" value={amountId} />
                      <button className="bg-blue-500 text-white  px-4 py-1 rounded-md">
                        Bénir
                      </button>
                    </form>
                  </div>
                  </div>
                ))
              }
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
*/

// /app/admin/expired-users/page.tsx

import { prismadb } from "@/lib/prismadb";
import { decrypt } from "@/lib/utils";
//
export default async function ExpiredUsersPage() {
  const expiredUsers = await prismadb.subscription.findMany({
    where: {
        endsAt: {
          lte: new Date(),
        },
      },
      include: {
        profile: true,
      },
      orderBy: {
        endsAt: "desc",
      },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Utilisateurs expirés</h1>

      {expiredUsers.length === 0 ? (
        <p className="text-gray-500">Aucun utilisateur avec un abonnement expiré.</p>
      ) : (
        <div className="grid gap-4">
          {expiredUsers.map((user) => (
            <div key={user.id} className="p-4 border rounded shadow-sm bg-white">
              <p><strong>Nom :</strong> {user.profile?.firstname} {decrypt(user.profile?.encryptedLastname)}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Codepin :</strong> {user.codepin}</p>
              <p><strong>Fin de l'abonnement :</strong> mettre la date ici</p>
              <p><strong>Jours restants :</strong> {user.remainingDays}</p>
              {/* Bouton pour relancer (plus tard) */}
              {/* <button className="mt-2 text-sm text-blue-500 hover:underline">Relancer</button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

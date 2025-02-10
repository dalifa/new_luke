"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function ActivityTracker({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut(); // Déconnecte l'utilisateur après 10 minutes d'inactivité
      }, 10 * 60 * 1000); // 10 minutes
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer(); // Initialise le timer au chargement

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);

  return <>{children}</>;
}

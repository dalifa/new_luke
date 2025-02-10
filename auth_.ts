/*
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"

const prisma = new PrismaClient()

export const { 
  handlers:{ GET, POST },
  auth, 
  signIn,
  signOut, 
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // ⚠️ Assure-toi que cette ligne est bien présente
  secret: process.env.AUTH_SECRET, // ⚠️ Nécessaire pour JWT
  ...authConfig,

  callbacks: {
    async jwt({ token }) {
      token.lastActive = Date.now(); // Met à jour l'activité à chaque requête
      return token;
    },

    async session({ session, token }) {
      if (!token || !token.lastActive) return null; // Empêche la session si le token est invalide
      const MAX_INACTIVITY_TIME = 10 * 60 * 1000; // 10 minutes
      const now = Date.now();

      if (now - token.lastActive > MAX_INACTIVITY_TIME) {
        return null; // Expire la session après 10 minutes d'inactivité
      }

      return session;
    }
  }
}) */




/*import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"

const prisma = new PrismaClient()

export const { 
  handlers:{ GET, POST },
  auth, 
  signIn,
  signOut, 
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // Utilisation des JWT
  ...authConfig,

  callbacks: {
    async session({ session, token }) {
      const MAX_INACTIVITY_TIME = 10 * 60 * 1000; // 10 minutes en millisecondes
      const now = Date.now();

      if (token.lastActive && now - token.lastActive > MAX_INACTIVITY_TIME) {
        // Expiration de la session si inactif trop longtemps
        return null;
      }

      // Mise à jour du timestamp d'activité
      token.lastActive = now;
      return session;
    },

    async jwt({ token }) {
      if (!token.lastActive) {
        token.lastActive = Date.now();
      }
      return token;
    }
  }
})
*/
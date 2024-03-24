// selon la doc auth.js
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client" //ou
//import { prismadb } from "./lib/prismadb"
import authConfig from "./auth.config"


const prisma = new PrismaClient() //si je choisi prismadb, je ne dois plus utiliser ceci 

// j'ai ajouté signIn et signOut et :{ GET, POST }, ici 
export const { 
  handlers:{ GET, POST },
  auth, 
  signIn,
  signOut, 
} = NextAuth({
  adapter: PrismaAdapter(prisma), // ou
  //adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
})
// selon la doc auth.js
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"

const prisma = new PrismaClient()

// j'ai ajouté signIn et signOut et :{ GET, POST }, ici
export const { 
  handlers:{ GET, POST },
  auth, 
  signIn,
  signOut, 
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
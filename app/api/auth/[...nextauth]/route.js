// /app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials, req) {
        //  console.log("Authorize called with:", {credentials})
        if (!credentials?.email || !credentials.password) {
          console.log("Credentials not set");
          return null;
        }
        const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:3000`;
        const res = await fetch(`${baseUrl}/api/login`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(credentials),
        });
        //   console.log("Result from the login endpoint", {res})
        if (res.ok) {
          const user = await res.json();
          // console.log("User is ", {user});
          return {
            ...user,
            success: true,
          };
        } else {
          const data = await res.json();
          return {
            error: data.message,
          };
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = user.id;
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (user?.error) {
        throw new Error(user.error);
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

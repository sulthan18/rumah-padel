import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        // EmailProvider({
        //   server: process.env.EMAIL_SERVER,
        //   from: process.env.EMAIL_FROM,
        // }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id
            }
            return token
        },
        session: async ({ session, token }) => {
            if (session?.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/auth/signin',
    },
}

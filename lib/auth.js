import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { id: user.id, email: user.email, role: user.role }
        }
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 5 * 60 // 5 minutes
  },
  jwt: {
    maxAge: 5 * 60 // 5 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = {
          sub: user.id,
          email: user.email,
          role: user.role
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub,
        email: token.email,
        role: token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login'
  }
}

export default NextAuth(authOptions)
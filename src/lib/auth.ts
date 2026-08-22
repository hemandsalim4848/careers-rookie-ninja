import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from './mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()
        const user = await User.findOne({ email: credentials.email.toLowerCase() })
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role,
        }
      },
    }),
  ],
 callbacks: {
  async jwt({ token, user, trigger }) {
    if (user) {
      token.id    = user.id
      token.role  = (user as any).role
      token.name  = user.name
      token.email = user.email
    }
    // Re-validate role from DB on every token refresh (not on initial sign-in)
    if (!user && token.id) {
      await connectDB()
      const dbUser = await User.findById(token.id).select('role name email').lean() as any
      if (!dbUser) return { ...token, role: null } // account deleted — invalidate
      token.role  = dbUser.role
      token.name  = dbUser.name
      token.email = dbUser.email
    }
    return token
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id    = token.id
      session.user.role  = token.role
      session.user.name  = token.name as string
      session.user.email = token.email as string
    }
    return session
  },
},
}
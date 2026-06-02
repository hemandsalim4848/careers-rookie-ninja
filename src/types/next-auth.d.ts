import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role: 'seeker' | 'hr'
  }
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: 'seeker' | 'hr'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'seeker' | 'hr'
  }
}
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role

    // HR-only routes — redirect non-HR to home
    if (pathname.startsWith('/dashboard/hr') && role !== 'hr') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Seeker-only routes — redirect non-seeker to home
    if (pathname.startsWith('/dashboard/seeker') && role !== 'seeker') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // If no token (not logged in), deny access to all protected routes
        if (!token) return false

        return true
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/jobs/:path*/apply',
  ],
}
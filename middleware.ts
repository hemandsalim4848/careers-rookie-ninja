import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role

    // HR-only routes
    if (pathname.startsWith('/dashboard/hr') && role !== 'hr') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Seeker-only routes
    if (pathname.startsWith('/dashboard/seeker') && role !== 'seeker') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/jobs/:path*/apply'],
}
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Careers — Rookie Ninja',
  description: 'Join Rookie Ninja. Explore open roles across engineering, design, and more.',
  openGraph: {
    title: 'Careers — Rookie Ninja',
    description: 'Join Rookie Ninja. Explore open roles across engineering, design, and more.',
    siteName: 'Rookie Ninja Careers',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
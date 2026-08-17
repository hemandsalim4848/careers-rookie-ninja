import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://careers.rookie-ninja.com'),
  title: {
    default: 'Careers — Rookie Ninja',
    template: '%s — Rookie Ninja Careers',
  },
  description: 'Join Rookie Ninja. Explore open roles across engineering, design, and more.',
  icons: { icon: '/favicon.ico' },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Careers — Rookie Ninja',
    description: 'Join Rookie Ninja. Explore open roles across engineering, design, and more.',
    siteName: 'Rookie Ninja Careers',
    url: 'https://careers.rookie-ninja.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers — Rookie Ninja',
    description: 'Join Rookie Ninja. Explore open roles across engineering, design, and more.',
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
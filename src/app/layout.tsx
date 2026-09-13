import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Disktorget – Søk - Kjøp - Selg',
  description:
    'Disktorget er markedsplassen for diskgolfspillere i Norge. Kjøp, selg og bytt disker og annet diskgolfutstyr.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="flex min-h-screen flex-col text-gray-900">
        <Navbar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

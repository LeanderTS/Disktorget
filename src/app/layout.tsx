import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Disktorget – Søk - Kjøp - Selg',
  description:
    'Disktorget er markedsplassen for diskgolfspillere i Norge. Kjøp, selg og bytt disker og annet diskgolfutstyr.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className="min-h-screen text-gray-900">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}

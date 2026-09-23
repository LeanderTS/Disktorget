import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="text-lg font-bold text-gray-900">
            Disktorget <span className="text-brand">Admin</span>
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/admin" className="hover:text-brand">
              Oversikt
            </Link>
            <Link href="/admin/statistikk" className="hover:text-brand">
              Statistikk
            </Link>
            <Link href="/admin/images" className="hover:text-brand">
              Bilder
            </Link>
            <Link href="/" className="hover:text-brand">
              Til siden →
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}

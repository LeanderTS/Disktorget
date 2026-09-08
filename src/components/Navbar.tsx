import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2"> <img src="/Disktorget Logo.png" alt="Disktorget" className="h-22 w-auto" /> </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-700 hover:text-brand-dark">
            Søk disk
          </Link>

          {user ? (
            <>
              <Link
                href="/sell"
                className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Selg din disk
              </Link>
              <Link href="/mine" className="text-sm text-gray-700 hover:text-brand-dark">
                Min side
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-brand-dark">
                Logg inn
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Registrer deg
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

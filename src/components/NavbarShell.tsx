'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

export default function NavbarShell({
  loggedIn,
  unreadBidCount,
}: {
  loggedIn: boolean
  unreadBidCount: number
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  const authLinks = loggedIn ? (
    <>
      <Link
        href="/sell"
        className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Legg ut disk
      </Link>

      <Link
        href="/mine/annonser"
        className="relative text-sm text-gray-700 hover:text-brand-dark"
      >
        Mine annonser
        {unreadBidCount > 0 && (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadBidCount}
          </span>
        )}
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
  )

  if (isHome) {
    return (
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Disktorget Logo.png" alt="Disktorget" className="h-26 w-auto md:h-28" />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="text-sm text-gray-700 hover:text-brand-dark">
              Søk etter disker
            </Link>
            {authLinks}
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Disktorget Logo.png" alt="Disktorget" className="h-20 w-auto" />
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-700 hover:text-brand-dark">
            Søk etter disker
          </Link>
          {authLinks}
        </nav>
      </div>
    </header>
  )
}

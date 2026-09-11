import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function NavbarShell({
  loggedIn,
  unreadBidCount,
}: {
  loggedIn: boolean
  unreadBidCount: number
}) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex flex-shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Disktorget Logo.png" alt="Disktorget" className="h-12 w-auto" />
        </Link>

        <form method="get" action="/" className="mx-auto w-full max-w-md flex-1">
          <div className="relative w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              name="q"
              placeholder="Søk etter disker ..."
              className="w-full rounded-full border bg-gray-50 py-2 pl-9 pr-4 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </form>

        <nav className="flex flex-shrink-0 items-center gap-4">
          {loggedIn ? (
            <>
              <IconLink href="/sell" label="Selg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </IconLink>

              <IconLink href="/mine/annonser" label="Annonser" badge={unreadBidCount}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path
                    fillRule="evenodd"
                    d="M2.5 4A1.5 1.5 0 001 5.5v9A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0017.5 4h-15zM3 6.06l7 3.5 7-3.5V14a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5V6.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </IconLink>

              <IconLink href="/mine" label="Min side">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.784-3.66a1 1 0 00-1.415 0l-.707.706a1 1 0 000 1.415l.707.707a1 1 0 001.415 0l.707-.707a1 1 0 000-1.415l-.707-.707zM10 12a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                  <path d="M10 2a8 8 0 00-6.32 12.906A6.97 6.97 0 0110 12a6.97 6.97 0 016.32 2.906A8 8 0 0010 2z" />
                </svg>
              </IconLink>

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

function IconLink({
  href,
  label,
  badge,
  children,
}: {
  href: string
  label: string
  badge?: number
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="relative flex flex-col items-center text-gray-600 hover:text-brand-dark"
    >
      {children}
      {typeof badge === 'number' && badge > 0 && (
        <span className="absolute -right-2 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
      <span className="text-[10px]">{label}</span>
    </Link>
  )
}

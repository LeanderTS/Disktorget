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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex flex-shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Disktorget Logo.png" alt="Disktorget" className="h-25 w-auto" />
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-6">
            <Link href="/sok" className="text-sm font-medium text-gray-700 hover:text-brand-dark">
            Søk etter disker
          </Link>

          <Link
            href="/sell"
            className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Selg disk
          </Link>

          {loggedIn && (
            <Link
              href="/mine/annonser"
              className="relative text-sm font-medium text-gray-700 hover:text-brand-dark"
            >
              Mine annonser
              {unreadBidCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {unreadBidCount}
                </span>
              )}
            </Link>
          )}

          {loggedIn && (
            <Link href="/mine" className="text-sm font-medium text-gray-700 hover:text-brand-dark">
              Min side
            </Link>
          )}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-3">
          {loggedIn ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.784-3.66a1 1 0 00-1.415 0l-.707.706a1 1 0 000 1.415l.707.707a1 1 0 001.415 0l.707-.707a1 1 0 000-1.415l-.707-.707zM10 12a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
                <path d="M10 2a8 8 0 00-6.32 12.906A6.97 6.97 0 0110 12a6.97 6.97 0 016.32 2.906A8 8 0 0010 2z" />
              </svg>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-brand-dark">
                Logg inn
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Registrer deg
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

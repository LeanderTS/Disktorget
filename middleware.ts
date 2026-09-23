import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server'

const VISITOR_COOKIE = 'dt_visitor'

// Denne middlewaren fornyer Supabase-sesjonen (auth-cookien) på hver request,
// slik at innlogging holder seg gyldig i Server Components. I tillegg
// registrerer den ett besøk pr. besøkende pr. dag (anonym cookie, ingen
// personopplysninger), til bruk i admin-statistikken.
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const shouldTrack = !path.startsWith('/admin') && !path.startsWith('/api')

  if (shouldTrack) {
    let visitorId = request.cookies.get(VISITOR_COOKIE)?.value
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      response.cookies.set(VISITOR_COOKIE, visitorId, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      })
    }

    event.waitUntil(
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          Prefer: 'resolution=ignore-duplicates,return=minimal',
        },
        body: JSON.stringify({ visitor_id: visitorId }),
      }).catch(() => {})
    )
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

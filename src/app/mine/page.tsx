import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function MinSidePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">Min side</h1>

      <div className="flex flex-col gap-4">
        <Link
          href="/mine/info"
          className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
        >
          <div className="text-lg font-semibold text-brand-dark">Brukerinfo</div>
          <p className="mt-1 text-sm text-gray-600">
            Endre brukernavn, e-post og mobilnummer.
          </p>
        </Link>

        <Link
          href="/mine/annonser"
          className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
        >
          <div className="text-lg font-semibold text-brand-dark">Mine annonser</div>
          <p className="mt-1 text-sm text-gray-600">
            Se, rediger og slett annonsene dine, og se innkomne bud.
          </p>
        </Link>

        <Link
          href="/mine/bud"
          className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
        >
          <div className="text-lg font-semibold text-brand-dark">Mine bud</div>
          <p className="mt-1 text-sm text-gray-600">
            Se og administrer budene du har lagt inn på andres annonser.
          </p>
        </Link>
      </div>
    </div>
  )
}

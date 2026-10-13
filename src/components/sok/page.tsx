import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { DISC_TYPE_LABELS, CONDITION_LABELS } from '@/lib/types'

type SavedSearch = {
  id: string
  q: string | null
  brand: string | null
  disc_type: string | null
  condition: string | null
  location: string | null
  max_price: number | null
}

function describe(s: SavedSearch) {
  const parts: string[] = []
  if (s.q) parts.push(`"${s.q}"`)
  if (s.brand) parts.push(s.brand)
  if (s.disc_type)
    parts.push((DISC_TYPE_LABELS as Record<string, string>)[s.disc_type] ?? s.disc_type)
  if (s.condition)
    parts.push((CONDITION_LABELS as Record<string, string>)[s.condition] ?? s.condition)
  if (s.location) parts.push(s.location)
  if (s.max_price) parts.push(`maks ${s.max_price} kr`)
  return parts.join(' · ')
}

function searchHref(s: SavedSearch) {
  const params = new URLSearchParams()
  if (s.q) params.set('q', s.q)
  if (s.brand) params.set('brand', s.brand)
  if (s.disc_type) params.set('disc_type', s.disc_type)
  if (s.condition) params.set('condition', s.condition)
  if (s.location) params.set('location', s.location)
  if (s.max_price) params.set('max_price', String(s.max_price))
  return `/sok?${params.toString()}`
}

export default async function LagredeSokPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('saved_searches')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const searches = (data ?? []) as SavedSearch[]

  async function deleteSearch(formData: FormData) {
    'use server'
    const supabase = createClient()
    const id = formData.get('id') as string
    await supabase.from('saved_searches').delete().eq('id', id)
    revalidatePath('/mine/sok')
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/mine" className="mb-4 inline-block text-sm text-brand-dark hover:underline">
        ← Min side
      </Link>
      <h1 className="mb-2 text-2xl font-bold">Lagrede søk</h1>
      <p className="mb-6 text-sm text-gray-600">
        Du får e-post når det legges ut nye annonser som matcher et av disse søkene.
      </p>

      {searches.length === 0 && (
        <p className="text-gray-500">
          Du har ingen lagrede søk ennå. Gå til{' '}
          <Link href="/sok" className="text-brand-dark underline">
            søkesiden
          </Link>
          , bruk filtrene og trykk «Varsle meg om nye treff».
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {searches.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-lg border bg-white p-4 shadow-sm"
          >
            <Link href={searchHref(s)} className="text-sm font-medium text-gray-900 hover:underline">
              {describe(s)}
            </Link>
            <form action={deleteSearch}>
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="text-sm text-red-600 hover:underline">
                Slett
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}

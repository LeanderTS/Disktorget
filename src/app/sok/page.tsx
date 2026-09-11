import { createClient } from '@/lib/supabase/server'
import SearchFilters from '@/components/SearchFilters'
import DiscCard from '@/components/DiscCard'
import type { Listing } from '@/lib/types'

export default async function SokPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const supabase = createClient()

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'aktiv')
    .order('created_at', { ascending: false })

  if (searchParams.q) {
    const term = searchParams.q.toLowerCase().replace(/[%_]/g, '')
    query = query.ilike('search_text', `%${term}%`)
  }
  if (searchParams.brand) {
    const term = searchParams.brand.toLowerCase().replace(/[%_]/g, '')
    query = query.ilike('search_text', `%${term}%`)
  }
  if (searchParams.disc_type) {
    const t = searchParams.disc_type
    query = query.or(`disc_type.eq.${t},search_text.ilike.%${t}%`)
  }
  if (searchParams.condition) {
    const c = searchParams.condition
    query = query.or(`condition.eq.${c},search_text.ilike.%${c}%`)
  }
  if (searchParams.location) {
    const term = searchParams.location.replace(/[%_]/g, '')
    query = query.ilike('location', `%${term}%`)
  }
  if (searchParams.max_price) {
    query = query.lte('price_nok', Number(searchParams.max_price))
  }

  const { data: listings, error } = await query.limit(60)

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Søk etter disk</h1>
        <p className="text-gray-600">
          Søk blant disker og samlinger som andre diskgolfspillere har lagt ut.
        </p>
      </div>

      <SearchFilters searchParams={searchParams} />

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Klarte ikke å hente annonser: {error.message}
        </p>
      )}

      {!error && listings && listings.length === 0 && (
        <p className="text-gray-500">Ingen disker matcher søket ditt ennå.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {(listings as Listing[] | null)?.map((listing) => (
          <DiscCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}

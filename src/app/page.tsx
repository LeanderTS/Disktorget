import { createClient } from '@/lib/supabase/server'
import SearchFilters from '@/components/SearchFilters'
import DiscCard from '@/components/DiscCard'
import type { Listing } from '@/lib/types'

export default async function HomePage({
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
    const term = searchParams.q.replace(/[%_]/g, '')
    query = query.or(
      `title.ilike.%${term}%,brand.ilike.%${term}%,mold.ilike.%${term}%`
    )
  }
  if (searchParams.brand) {
    query = query.ilike('brand', `%${searchParams.brand}%`)
  }
  if (searchParams.disc_type) {
    query = query.eq('disc_type', searchParams.disc_type)
  }
  if (searchParams.condition) {
    query = query.eq('condition', searchParams.condition)
  }
  if (searchParams.listing_type) {
    query = query.eq('listing_type', searchParams.listing_type)
  }
  if (searchParams.max_price) {
    query = query.lte('price_nok', Number(searchParams.max_price))
  }

  const { data: listings, error } = await query.limit(60)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bla i disker</h1>
        <p className="text-gray-600">
          Søk blant disker som andre diskgolfspillere har lagt ut til salg eller bytte.
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

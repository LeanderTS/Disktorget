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

  const { data: listings, error } = await supabase.rpc('search_listings', {
    search_term: searchParams.q ?? null,
    filter_brand: searchParams.brand ?? null,
    filter_disc_type: searchParams.disc_type ?? null,
    filter_condition: searchParams.condition ?? null,
    filter_location: searchParams.location ?? null,
    filter_max_price: searchParams.max_price ? Number(searchParams.max_price) : null,
  })

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Søk etter disk</h1>
        <p className="text-gray-600">
          Søk blant disker og samlinger som andre diskgolfspillere har lagt ut.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <aside>
          <SearchFilters searchParams={searchParams} />
        </aside>

        <div>
          {error && (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              Klarte ikke å hente annonser: {error.message}
            </p>
          )}

          {!error && listings && listings.length === 0 && (
            <p className="text-gray-500">Ingen disker matcher søket ditt ennå.</p>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {(listings as Listing[] | null)?.map((listing) => (
              <DiscCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

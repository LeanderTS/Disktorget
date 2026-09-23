import { createClient } from '@/lib/supabase/server'
import SearchFilters from '@/components/SearchFilters'
import DiscCard from '@/components/DiscCard'
import Link from 'next/link'
import type { Listing } from '@/lib/types'

const PAGE_SIZE = 50

export default async function SokPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const supabase = createClient()

  const currentPage = Math.max(1, Number(searchParams.page ?? '1') || 1)
  const offset = (currentPage - 1) * PAGE_SIZE

  const { data: listings, error } = await supabase.rpc('search_listings', {
    search_term: searchParams.q ?? null,
    filter_brand: searchParams.brand ?? null,
    filter_disc_type: searchParams.disc_type ?? null,
    filter_condition: searchParams.condition ?? null,
    filter_location: searchParams.location ?? null,
    filter_max_price: searchParams.max_price ? Number(searchParams.max_price) : null,
    filter_limit: PAGE_SIZE + 1,
    filter_offset: offset,
  })

  const allResults = (listings as Listing[] | null) ?? []
  const hasNextPage = allResults.length > PAGE_SIZE
  const pageResults = hasNextPage ? allResults.slice(0, PAGE_SIZE) : allResults

  function pageHref(page: number) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (key !== 'page' && value) params.set(key, value)
    }
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return qs ? `/sok?${qs}` : '/sok'
  }

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

          {!error && pageResults.length === 0 && (
            <p className="text-gray-500">Ingen disker matcher søket ditt ennå.</p>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {pageResults.map((listing) => (
              <DiscCard key={listing.id} listing={listing} />
            ))}
          </div>

          {(currentPage > 1 || hasNextPage) && (
            <div className="mt-8 flex items-center justify-between">
              {currentPage > 1 ? (
                <Link
                  href={pageHref(currentPage - 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  ← Forrige
                </Link>
              ) : (
                <span />
              )}

              <span className="text-sm text-gray-500">Side {currentPage}</span>

              {hasNextPage ? (
                <Link
                  href={pageHref(currentPage + 1)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Neste →
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

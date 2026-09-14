import Link from 'next/link'
import Hero from '@/components/Hero'
import FeaturedDiscCard from '@/components/FeaturedDiscCard'
import { createClient } from '@/lib/supabase/server'
import type { Listing } from '@/lib/types'

export default async function HomePage() {
  const supabase = createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'aktiv')
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <div>
      <Hero />

      <section className="py-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Nyeste annonser</h2>
          <Link href="/sok" className="text-sm text-brand-dark hover:underline">
            Se alle →
          </Link>
        </div>

        {listings && listings.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {(listings as Listing[]).map((listing) => (
                <FeaturedDiscCard key={listing.id} listing={listing} />
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/sok"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-brand px-7 py-3 text-sm font-semibold text-brand-dark shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand hover:text-white hover:shadow-lg"
              >
                Se mer
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Ingen annonser lagt ut ennå.</p>
        )}
      </section>
    </div>
  )
}

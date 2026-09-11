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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {(listings as Listing[]).map((listing) => (
              <FeaturedDiscCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Ingen annonser lagt ut ennå.</p>
        )}
      </section>
    </div>
  )
}

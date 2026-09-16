import Link from 'next/link'
import type { Listing } from '@/lib/types'

export default function FeaturedDiscCard({ listing }: { listing: Listing }) {
  const image = listing.image_urls?.[0]
  const isCollection = listing.listing_kind === 'samling'

  return (
    <Link
      href={`/disc/${listing.id}`}
      className="group relative block aspect-square overflow-hidden rounded-lg bg-gray-200"
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
          Ingen bilde
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-white">{listing.title}</h3>
        <p className="mt-0.5 text-xs text-white/80">
          {isCollection ? `Samling · ${listing.items?.length ?? 0} disker` : listing.brand}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <p className="text-sm font-bold text-white">
            {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
          </p>
          {listing.is_hbo && (
            <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              HBO
            </span>
          )}
          {!isCollection && listing.disk_rate && (
            <span className="flex items-center gap-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.958z" />
              </svg>
              {listing.disk_rate}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

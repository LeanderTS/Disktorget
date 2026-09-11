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
        <p className="mt-1 text-sm font-bold text-white">
          {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
        </p>
      </div>
    </Link>
  )
}


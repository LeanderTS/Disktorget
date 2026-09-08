import Link from 'next/link'
import type { Listing } from '@/lib/types'
import { LISTING_TYPE_LABELS } from '@/lib/types'

export default function DiscCard({ listing }: { listing: Listing }) {
  const image = listing.image_urls?.[0]
  const isCollection = listing.listing_kind === 'samling'

  return (
    <Link
      href={`/disc/${listing.id}`}
      className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-square w-full bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Ingen bilde
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="font-medium text-gray-900">{listing.title}</h3>

        {isCollection ? (
          <p className="text-sm text-gray-500">
            Samling · {listing.items?.length ?? 0} disker
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            {listing.brand}
            {listing.mold ? ` · ${listing.mold}` : ''}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-1">
          {isCollection ? (
            <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs text-brand-dark">
              Samling
            </span>
          ) : null}
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {LISTING_TYPE_LABELS[listing.listing_type]}
          </span>
        </div>

        <div className="mt-auto pt-2 font-semibold text-brand-dark">
          {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
        </div>
      </div>
    </Link>
  )
}

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

        {listing.location && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933a.375.375 0 00.62 0c.148-.221 4.19-6.256 4.19-10.183a4.5 4.5 0 10-9 0c0 3.927 4.042 9.962 4.19 10.183zM10 10.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                clipRule="evenodd"
              />
            </svg>
            {listing.location}
          </p>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-1">
          {isCollection ? (
            <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs text-brand-dark">
              Samling
            </span>
          ) : null}
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {LISTING_TYPE_LABELS[listing.listing_type]}
          </span>
          {!isCollection && listing.disk_rate && (
            <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.062 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.958z" />
              </svg>
              {listing.disk_rate}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-2">
          <span className="font-semibold text-brand-dark">
            {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
          </span>
          {listing.is_hbo && (
            <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              HBO
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

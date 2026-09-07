import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  DISC_TYPE_LABELS,
  CONDITION_LABELS,
  LISTING_TYPE_LABELS,
  type Listing,
  type Profile,
} from '@/lib/types'

export default async function DiscDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single<Listing>()

  if (!listing) notFound()

  const { data: seller } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', listing.user_id)
    .single<Profile>()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        {listing.image_urls?.length ? (
          <div className="grid grid-cols-2 gap-2">
            {listing.image_urls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt={listing.title}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            Ingen bilder
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold">{listing.title}</h1>
        <p className="text-gray-600">
          {listing.brand}
          {listing.mold ? ` · ${listing.mold}` : ''}
        </p>

        <div className="mt-3 text-2xl font-semibold text-brand-dark">
          {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Detail label="Type" value={DISC_TYPE_LABELS[listing.disc_type]} />
          <Detail label="Tilstand" value={CONDITION_LABELS[listing.condition]} />
          <Detail label="Salg/bytte" value={LISTING_TYPE_LABELS[listing.listing_type]} />
          {listing.plastic && <Detail label="Plast" value={listing.plastic} />}
          {listing.color && <Detail label="Farge" value={listing.color} />}
          {listing.weight_grams && <Detail label="Vekt" value={`${listing.weight_grams} g`} />}
          {listing.location && <Detail label="Sted" value={listing.location} />}
        </div>

        {listing.description && (
          <div className="mt-4">
            <h2 className="mb-1 font-medium">Beskrivelse</h2>
            <p className="whitespace-pre-line text-gray-700">{listing.description}</p>
          </div>
        )}

        <div className="mt-6 rounded-lg border bg-white p-4">
          <h2 className="mb-1 font-medium">Selger</h2>
          <p className="text-gray-700">{seller?.username ?? 'Ukjent bruker'}</p>
          {seller?.contact_email ? (
            <a
              href={`mailto:${seller.contact_email}?subject=${encodeURIComponent(
                'Disktorget: ' + listing.title
              )}`}
              className="mt-2 inline-block rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Kontakt selger
            </a>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              Selger har ikke lagt til kontakt-e-post ennå.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-gray-400">{label}</div>
      <div className="text-gray-800">{value}</div>
    </div>
  )
}

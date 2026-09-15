import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BidForm from '@/components/BidForm'
import BuyButton from '@/components/BuyButton'
import BidHistory from '@/components/BidHistory'
import {
  DISC_TYPE_LABELS,
  CONDITION_LABELS,
  LISTING_TYPE_LABELS,
  type Listing,
} from '@/lib/types'

export default async function DiscDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single<Listing>()

  if (!listing) notFound()

  const { data: sellerPublic } = await supabase
    .from('public_profiles')
    .select('id, username')
    .eq('id', listing.user_id)
    .single()

  const { data: sellerContact } = await supabase
    .rpc('get_public_contact', { seller_id: listing.user_id })
    .single<{ contact_email: string | null; contact_phone: string | null }>()

  const seller = {
    username: sellerPublic?.username ?? null,
    contact_email: sellerContact?.contact_email ?? null,
    contact_phone: sellerContact?.contact_phone ?? null,
  }

  const { data: bidRows } = await supabase
    .from('bids')
    .select('*')
    .eq('listing_id', listing.id)
    .order('created_at', { ascending: false })

  const bids = bidRows ?? []

  const bidderIds = Array.from(new Set(bids.map((b) => b.bidder_id)))
  let biddersMap: Record<string, string> = {}

  if (bidderIds.length > 0) {
    const { data: bidderProfiles } = await supabase
      .from('public_profiles')
      .select('id, username')
      .in('id', bidderIds)

    biddersMap = Object.fromEntries(
      (bidderProfiles ?? []).map((p) => [p.id, p.username ?? 'Ukjent bruker'])
    )
  }

  const canShowPhone = Boolean(seller?.contact_phone)
  const auctionEnded = Boolean(
    listing.auction_end_at && new Date(listing.auction_end_at) < new Date()
  )
  const isCollection = listing.listing_kind === 'samling'

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

        {listing.allow_bids && listing.auction_end_at && (
          <div
            className={`mt-4 flex items-center gap-3 rounded-lg border-2 p-3 ${
              auctionEnded
                ? 'border-gray-200 bg-gray-50'
                : 'border-amber-400 bg-amber-50'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-6 w-6 flex-shrink-0 ${
                auctionEnded ? 'text-gray-400' : 'text-amber-600'
              }`}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  auctionEnded ? 'text-gray-500' : 'text-amber-700'
                }`}
              >
                {auctionEnded ? 'Auksjonen er avsluttet' : 'Auksjon slutter'}
              </p>
              <p
                className={`text-lg font-bold ${
                  auctionEnded ? 'text-gray-600' : 'text-amber-800'
                }`}
              >
                {new Date(listing.auction_end_at).toLocaleString('no-NO', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: 'Europe/Oslo',
                })}
              </p>
            </div>
          </div>
        )}

        {listing.allow_bids ? (
          auctionEnded ? (
            <div className="mt-4 rounded-lg border bg-gray-50 p-4 text-sm text-gray-500">
              Auksjonen er avsluttet og det er ikke lenger mulig å legge inn bud.
            </div>
          ) : (
            <BidForm listing={listing} />
          )
        ) : (
          <BuyButton listing={listing} />
        )}

        <BidHistory
          bids={bids.map((b) => ({
            id: b.id,
            bidder_id: b.bidder_id,
            item_index: b.item_index,
            amount_nok: b.amount_nok,
            bidderName: biddersMap[b.bidder_id] ?? 'Ukjent bruker',
          }))}
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold">{listing.title}</h1>

        {isCollection ? (
          <p className="text-gray-600">Samling · {listing.items?.length ?? 0} disker</p>
        ) : (
          <p className="text-gray-600">
            {listing.brand}
            {listing.mold ? ` · ${listing.mold}` : ''}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <span className="text-2xl font-semibold text-brand-dark">
            {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
          </span>
          {listing.is_hbo && (
            <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
              HBO
            </span>
          )}
        </div>

        {isCollection ? (
          <div className="mt-4">
            <h2 className="mb-2 font-medium">Disker i samlingen</h2>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Merke</th>
                    <th className="px-3 py-2">Modell</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Tilstand</th>
                    <th className="px-3 py-2">Disk Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {listing.items?.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="whitespace-nowrap px-3 py-2 text-gray-500">
                        Disk {i + 1}
                      </td>
                      <td className="px-3 py-2">{item.brand}</td>
                      <td className="px-3 py-2">{item.mold ?? '–'}</td>
                      <td className="px-3 py-2">{DISC_TYPE_LABELS[item.disc_type]}</td>
                      <td className="px-3 py-2">{CONDITION_LABELS[item.condition]}</td>
                      <td className="px-3 py-2">{item.disk_rate ?? '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-sm">
              <Detail label="Salg/bytte" value={LISTING_TYPE_LABELS[listing.listing_type]} />
              {listing.location && (
                <div className="mt-2">
                  <Detail label="Sted" value={listing.location} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Detail label="Type" value={DISC_TYPE_LABELS[listing.disc_type]} />
            <Detail label="Tilstand" value={CONDITION_LABELS[listing.condition]} />
            {listing.disk_rate && <Detail label="Disk Rate" value={listing.disk_rate} />}
            <Detail label="Salg/bytte" value={LISTING_TYPE_LABELS[listing.listing_type]} />
            {listing.plastic && <Detail label="Plast" value={listing.plastic} />}
            {listing.color && <Detail label="Farge" value={listing.color} />}
            {listing.weight_grams && <Detail label="Vekt" value={`${listing.weight_grams} g`} />}
            {listing.location && <Detail label="Sted" value={listing.location} />}
          </div>
        )}

        {listing.description && (
          <div className="mt-4">
            <h2 className="mb-1 font-medium">Beskrivelse</h2>
            <p className="whitespace-pre-line text-gray-700">{listing.description}</p>
          </div>
        )}

        <div className="mt-6 rounded-lg border bg-white p-4">
          <h2 className="mb-1 font-medium">Selger</h2>
          <p className="text-gray-700">{seller?.username ?? 'Ukjent bruker'}</p>

          {!seller?.contact_email && !canShowPhone && (
            <p className="mt-2 text-sm text-gray-500">
              Selger har ikke lagt til kontaktinfo ennå.
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-2">
            {seller?.contact_email && (
              <a href={`mailto:${seller.contact_email}?subject=${encodeURIComponent(
                  'Disktorget: ' + listing.title
                )}`}
                className="inline-block rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Kontakt selger på e-post
              </a>
            )}

            {canShowPhone && (
              <a href={`tel:${seller.contact_phone!.replace(/\s/g, '')}`}
                className="inline-block rounded-md border border-brand px-3 py-1.5 text-sm font-medium text-brand-dark hover:bg-brand-light"
              >
                Mobil {seller.contact_phone!}
              </a>
            )}
          </div>
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

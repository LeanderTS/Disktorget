import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Listing } from '@/lib/types'

export default async function AnnoncerPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const listingIds = (listings ?? []).map((l) => l.id)

  let bids: {
    id: string
    listing_id: string
    bidder_id: string
    item_index: number | null
    amount_nok: number
  }[] = []

  if (listingIds.length > 0) {
    const { data: bidRows } = await supabase
      .from('bids')
      .select('*')
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false })
    bids = bidRows ?? []
  }

  const bidderIds = Array.from(new Set(bids.map((b) => b.bidder_id)))
  let biddersMap: Record<string, string> = {}

  if (bidderIds.length > 0) {
    const { data: bidderProfiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', bidderIds)

    biddersMap = Object.fromEntries(
      (bidderProfiles ?? []).map((p) => [p.id, p.username ?? 'Ukjent bruker'])
    )
  }

  async function deleteListing(formData: FormData) {
    'use server'
    const supabase = createClient()
    const id = formData.get('id') as string
    await supabase.from('listings').delete().eq('id', id)
    revalidatePath('/mine/annonser')
  }

  return (
    <div>
      <Link href="/mine" className="mb-4 inline-block text-sm text-brand-dark hover:underline">
        ← Min side
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mine annonser</h1>
        <Link href="/sell" className="text-sm text-brand-dark underline">
          + Legg ut ny disk
        </Link>
      </div>

      {!listings || listings.length === 0 ? (
        <p className="text-gray-500">Du har ikke lagt ut noen disker ennå.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {(listings as Listing[]).map((listing) => {
            const listingBids = bids.filter((b) => b.listing_id === listing.id)

            return (
              <div key={listing.id} className="rounded-lg border bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href={`/disc/${listing.id}`} className="font-medium hover:underline">
                      {listing.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {listing.status} ·{' '}
                      {listing.price_nok ? `${listing.price_nok} kr` : 'Pris på forespørsel'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/edit/${listing.id}`}
                      className="text-sm text-brand-dark hover:underline"
                    >
                      Rediger
                    </Link>

                    <form action={deleteListing}>
                      <input type="hidden" name="id" value={listing.id} />
                      <button type="submit" className="text-sm text-red-600 hover:underline">
                        Slett
                      </button>
                    </form>
                  </div>
                </div>

                {listingBids.length > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <p className="mb-1 text-xs font-medium uppercase text-gray-400">
                      Bud mottatt ({listingBids.length})
                    </p>
                    <ul className="flex flex-col gap-1">
                      {listingBids.map((bid) => (
                        <li key={bid.id} className="text-sm text-gray-700">
                          {biddersMap[bid.bidder_id] ?? 'Ukjent bruker'} bød{' '}
                          <span className="font-semibold">{bid.amount_nok} kr</span>
                          {bid.item_index !== null && ` på Disk ${bid.item_index + 1}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import UsernameForm from '@/components/UsernameForm'
import type { Listing } from '@/lib/types'

export default async function MinSidePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
    created_at: string
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

  async function updateContactInfo(formData: FormData) {
    'use server'
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const contact_email = formData.get('contact_email') as string
    const contact_phone = formData.get('contact_phone') as string
    const show_phone = formData.get('show_phone') === 'on'

    await supabase
      .from('profiles')
      .update({ contact_email, contact_phone, show_phone })
      .eq('id', user.id)

    revalidatePath('/mine')
  }

  async function deleteListing(formData: FormData) {
    'use server'
    const supabase = createClient()
    const id = formData.get('id') as string
    await supabase.from('listings').delete().eq('id', id)
    revalidatePath('/mine')
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Min side</h1>

      <section className="mb-8 rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Brukernavn</h2>
        <UsernameForm userId={user.id} currentUsername={profile?.username ?? null} />
      </section>

      <section className="mb-8 rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Kontaktinfo (vises på dine annonser)</h2>
        <form action={updateContactInfo} className="flex max-w-sm flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">E-post</label>
            <input
              type="email"
              name="contact_email"
              defaultValue={profile?.contact_email ?? ''}
              placeholder="din@epost.no"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Mobilnummer <span className="font-normal text-gray-400">(valgfritt)</span>
            </label>
            <input
              type="tel"
              name="contact_phone"
              defaultValue={profile?.contact_phone ?? ''}
              placeholder="+47 123 45 678"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="show_phone"
              defaultChecked={profile?.show_phone ?? false}
              className="mt-0.5 h-4 w-4"
            />
            Vis mobilnummeret mitt offentlig på annonsene mine
          </label>
          <p className="-mt-2 text-xs text-gray-500">
            Nummeret lagres uansett, men vises kun til andre brukere hvis du krysser av her.
          </p>

          <button
            type="submit"
            className="mt-1 rounded-md bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Lagre
          </button>
        </form>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Mine annonser</h2>
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
                      <Link
                        href={`/disc/${listing.id}`}
                        className="font-medium hover:underline"
                      >
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
      </section>
    </div>
  )
}

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import MyBidsList from '@/components/MyBidsList'

export default async function MineBudPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: bidRows } = await supabase
    .from('bids')
    .select('*')
    .eq('bidder_id', user.id)
    .order('created_at', { ascending: false })

  const bids = bidRows ?? []
  const listingIds = Array.from(new Set(bids.map((b) => b.listing_id)))

  let listingsMap: Record<string, string> = {}
  if (listingIds.length > 0) {
    const { data: listingRows } = await supabase
      .from('listings')
      .select('id, title')
      .in('id', listingIds)

    listingsMap = Object.fromEntries((listingRows ?? []).map((l) => [l.id, l.title]))
  }

  const myBids = bids.map((b) => ({
    id: b.id,
    listing_id: b.listing_id,
    listing_title: listingsMap[b.listing_id] ?? 'Annonse (slettet)',
    item_index: b.item_index,
    amount_nok: b.amount_nok,
  }))

  return (
    <div>
      <Link href="/mine" className="mb-4 inline-block text-sm text-brand-dark hover:underline">
        ← Min side
      </Link>

      <h1 className="mb-4 text-2xl font-bold">Mine bud</h1>

      <MyBidsList bids={myBids} />
    </div>
  )
}

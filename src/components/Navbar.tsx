import { createClient } from '@/lib/supabase/server'
import NavbarShell from './NavbarShell'

export default async function Navbar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let unreadBidCount = 0

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('annonser_last_viewed_at')
      .eq('id', user.id)
      .single()

    const { data: listings } = await supabase
      .from('listings')
      .select('id')
      .eq('user_id', user.id)

    const listingIds = (listings ?? []).map((l) => l.id)

    if (listingIds.length > 0) {
      let query = supabase
        .from('bids')
        .select('id', { count: 'exact', head: true })
        .in('listing_id', listingIds)

      if (profile?.annonser_last_viewed_at) {
        query = query.gt('created_at', profile.annonser_last_viewed_at)
      }

      const { count } = await query
      unreadBidCount = count ?? 0
    }
  }

  return <NavbarShell loggedIn={!!user} unreadBidCount={unreadBidCount} />
}

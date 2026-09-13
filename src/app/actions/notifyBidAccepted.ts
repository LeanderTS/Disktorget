'use server'

import { createClient } from '@/lib/supabase/server'

export async function notifyBidAccepted(bidId: string) {
  if (!bidId) return

  const supabase = createClient()

  const { data: bid } = await supabase
    .from('bids')
    .select('bidder_email, amount_nok, listing_id')
    .eq('id', bidId)
    .single()

  if (!bid?.bidder_email) return

  const { data: listing } = await supabase
    .from('listings')
    .select('title')
    .eq('id', bid.listing_id)
    .single()

  const title = listing?.title ?? 'annonsen'

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Disktorget <bud@disktorget.no>',
        to: bid.bidder_email,
        subject: `Ditt bud ble akseptert på "${title}"`,
        text: `Gode nyheter! Selgeren har akseptert budet ditt på ${bid.amount_nok} kr for "${title}".\n\nSe annonsen: https://disktorget.no/disc/${bid.listing_id}`,
      }),
    })
  } catch {
    // Ignorer feil ved e-postsending - annonsen er uansett markert som solgt
  }
}
